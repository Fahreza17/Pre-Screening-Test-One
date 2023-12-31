import { useState, useEffect } from 'react';
import { VStack, Heading, Text, Button, Input, Box, Flex, Image, useToast, Center } from '@chakra-ui/react';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/router';

const BookDetail = ({ bookId }) => {
    const [book, setBook] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedBook, setEditedBook] = useState({
        title: '',
        author: '',
        publisher: '',
        year: '',
        pages: '',
        image: null,
    });

    const router = useRouter()

    const toast = useToast();

    const getBookById = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`/api/books/${bookId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setBook(data.book);
                setEditedBook({
                    title: data.book.title,
                    author: data.book.author,
                    publisher: data.book.publisher,
                    year: String(data.book.year),
                    pages: String(data.book.pages),
                    image: data.book.image,
                });
            } else {
                const errorData = await response.json();
                console.error('Error getting book:', errorData.message);
            }
        } catch (error) {
            console.error('Error getting book:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast({
                title: 'Please Login First',
                description: 'You need to login before accessing this page',
                status: 'info',
                duration: 3000,
                isClosable: true,
            });
            router.push('/login');
            return;
        }

        getBookById();
    }, [bookId, router, toast]);
    
    const handleUpdateBook = async () => {
        const token = localStorage.getItem('token');

        const updatedData = {
            title: editedBook.title,
            author: editedBook.author,
            publisher: editedBook.publisher,
            year: parseInt(editedBook.year),
            pages: parseInt(editedBook.pages),
            image: editedBook.image,
        };

        try {
            const response = await fetch(`/api/books/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                console.log('Book updated successfully');
                toast({
                    title: 'Success',
                    description: 'Book updated successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                setIsEditing(false);
                getBookById();
            } else {
                const errorData = await response.json();
                console.error('Error updating book:', errorData.message);
            }
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    const handleDeleteBook = async () => {
        const isConfirmed = window.confirm('Apakah Anda yakin ingin menghapus buku ini?');

        if (isConfirmed) {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch(`/api/books/${bookId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    console.log('Book deleted successfully');
                    toast({
                        title: 'Success',
                        description: 'Book deleted successfully',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                    router.push('/')
                } else {
                    const errorData = await response.json();
                    console.error('Error deleting book:', errorData.message);
                }
            } catch (error) {
                console.error('Error deleting book:', error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedBook((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <VStack spacing={8} align="stretch">
            <Navbar />
            {book ? (
                <Box justifyContent="Center" p={8} borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white" w="auto" mx="auto">
                    <Flex direction={{ base: 'column', md: 'row' }} align="center">
                        <Image
                            src={book.image}
                            alt={book.title}
                            boxSize={{ base: '100%', md: '200px' }}
                            objectFit="cover"
                            borderTopRadius="lg"
                            mr={{ base: 0, md: 8 }}
                            mb={{ base: 4, md: 0 }}
                        />
                        <VStack align="stretch" flex="1">
                            {isEditing ? (
                                <VStack align="stretch">
                                    <Heading>Edit Book</Heading>
                                    <form>
                                        <Input
                                            type="text"
                                            name="title"
                                            value={editedBook.title}
                                            onChange={handleChange}
                                            placeholder="Title"
                                            mb={4}
                                        />
                                        <Input
                                            type="text"
                                            name="author"
                                            value={editedBook.author}
                                            onChange={handleChange}
                                            placeholder="Author"
                                            mb={4}
                                        />
                                        <Input
                                            type="text"
                                            name="publisher"
                                            value={editedBook.publisher}
                                            onChange={handleChange}
                                            placeholder="Publisher"
                                            mb={4}
                                        />
                                        <Input
                                            type="number"
                                            name="year"
                                            value={editedBook.year}
                                            onChange={handleChange}
                                            placeholder="Year"
                                            mb={4}
                                        />
                                        <Input
                                            type="number"
                                            name="pages"
                                            value={editedBook.pages}
                                            onChange={handleChange}
                                            placeholder="Pages"
                                            mb={4}
                                        />
                                        <Button colorScheme="teal" onClick={handleUpdateBook}>
                                            Save Changes
                                        </Button>
                                    </form>
                                </VStack>
                            ) : (
                                <VStack align="stretch">
                                    <Heading>{book.title}</Heading>
                                    <Text>Author: {book.author}</Text>
                                    <Text>Publisher: {book.publisher}</Text>
                                    <Text>Year: {book.year}</Text>
                                    <Text>Pages: {book.pages}</Text>
                                    <Flex  mt={4}>
                                        <Button margin={2} colorScheme="teal" onClick={() => setIsEditing(true)}>
                                            Edit
                                        </Button>
                                        <Button margin={2} colorScheme="red" onClick={handleDeleteBook}>
                                            Delete
                                        </Button>
                                    </Flex>
                                </VStack>
                            )}
                        </VStack>
                    </Flex>
                </Box>
            ) : (
                <Text></Text>
            )}
        </VStack>
    );
};

export async function getServerSideProps({ params }) {
    return {
        props: {
            bookId: params.id,
        },
    };
}

export default BookDetail;
