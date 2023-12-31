import { useEffect, useState } from 'react';
import {
    Button,
    Flex,
    Text,
    HStack,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from 'next/router';

const Navbar = () => {
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            setIsAuthenticated(!!token);
        }
    }, []);

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            onClose();
            router.push('/login')
        }
    };

    return (
        <Flex
            w="full"
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1rem"
            bg="teal.500"
            color="white"
        >
            <Link href="/" passHref>
                <Flex align="center" mr={5} cursor="pointer">
                    <Text fontSize="xl" fontWeight="bold">
                        Book List
                    </Text>
                </Flex>
            </Link>
            <HStack>
                {isAuthenticated && (
                    <Link href="/createBook" passHref>
                        <Button colorScheme="blackAlpha">Create New Book</Button>
                    </Link>
                )}
                {!isAuthenticated ? (
                    <Button as={Link} href="/login" passHref colorScheme="blue">
                        Login
                    </Button>
                ) : (
                    <Button colorScheme="blue" onClick={handleLogout}>
                        Logout
                    </Button>
                )}
            </HStack>
        </Flex>
    );
};

export default Navbar;
