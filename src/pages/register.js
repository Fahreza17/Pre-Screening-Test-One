import { useState } from 'react';
import { useRouter } from 'next/router';
import {
    VStack,
    Box,
    Input,
    Button,
    FormControl,
    FormLabel,
    Heading,
    Text,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import Navbar from '@/components/Navbar';

export default function RegisterForm() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Something went wrong');
            }

            router.push('/login');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <VStack align="center" spacing={4} p={4} mt={4}>
                <Box w="100%" maxW="400px" p={6} borderWidth="1px" borderRadius="lg">
                    <Heading mb={4} textAlign="center">
                        Register
                    </Heading>
                    <form onSubmit={handleSubmit}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </FormControl>

                        {error && (
                            <Alert status="error" mt={4}>
                                <AlertIcon />
                                {error}
                            </Alert>
                        )}

                        <Button type="submit" mt={4} colorScheme="teal" isLoading={loading}>
                            Register
                        </Button>
                    </form>
                    <Text mt={4} textAlign="center">
                        Already have an account?{' '}
                        <Text as="span" color="teal.500" cursor="pointer" onClick={() => router.push('/login')}>
                            Login here
                        </Text>
                    </Text>
                </Box>
            </VStack>
        </>
    );
}
