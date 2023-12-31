import { useState } from 'react';
import { useRouter } from 'next/router';
import {
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    Box,
    VStack,
} from '@chakra-ui/react';

const CreateBook = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        publisher: '',
        year: '',
        pages: '',
        image: null,
    });

    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            image: file,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('author', formData.author);
        formDataToSend.append('publisher', formData.publisher);
        formDataToSend.append('year', formData.year);
        formDataToSend.append('pages', formData.pages);
        formDataToSend.append('image', formData.image);

        try {
            const response = await fetch('/api/books/create', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Book created:', data.book);
                router.push('/');
            } else {
                const errorData = await response.json();
                console.error('Error creating book:', errorData.message);
            }
        } catch (error) {
            console.error('Error creating book:', error);
        }
    };

    return (
        <VStack spacing={8} align="stretch">
            <Heading>Create Book</Heading>
            <Box p={4} borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white" w="100%">
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="stretch">
                        <FormControl>
                            <FormLabel>Title:</FormLabel>
                            <Input type="text" name="title" onChange={handleChange} required />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Author:</FormLabel>
                            <Input type="text" name="author" onChange={handleChange} required />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Publisher:</FormLabel>
                            <Input type="text" name="publisher" onChange={handleChange} required />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Year:</FormLabel>
                            <Input type="number" name="year" onChange={handleChange} required />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Pages:</FormLabel>
                            <Input type="number" name="pages" onChange={handleChange} required />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Image:</FormLabel>
                            <Input type="file" name="image" onChange={handleImageChange} required />
                        </FormControl>
                        <Button type="submit" colorScheme="teal">
                            Create Book
                        </Button>
                    </VStack>
                </form>
            </Box>
        </VStack>
    );
};

export default CreateBook;
