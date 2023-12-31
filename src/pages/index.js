import { VStack, Box, Image, Text, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";

const Homepage = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch("/api/books/getAll");
      const data = await response.json();
      setBooks(data.books);
    };

    fetchBooks();
  }, []);

  return (
    <>
      <Navbar />
      <VStack w="100%" p={8} spacing={8}>
        <Flex
          direction="row"
          flexWrap="wrap"
          justifyContent="space-around"
          alignItems="center"
          gap={8}
        >
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/book/${book.id}`}
              passHref
            >
              <Box
                maxW="sm"
                overflow="hidden"
                bg="white"
                flex="1"
                textAlign="center"
                cursor="pointer"
                borderWidth="1px"           
                borderRadius="lg"           
                borderColor="black"
                padding="10px"
                transition="transform 0.2s"
                _hover={{ transform: "scale(1.05)" }}
              >
                <Image
                  src={book.image}
                  alt={book.title}
                  boxSize="200px"
                  objectFit="cover"
                  borderTopRadius="lg"
                  mx="auto"
                  my={4}
                />

                <Box p={4}>
                  <Text fontSize="sm" color="black" fontWeight="semibold">
                    {book.title} ({book.year})
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {book.author}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    <span>Publisher: </span>
                    {book.publisher}
                  </Text>
                </Box>
              </Box>
            </Link>
          ))}
        </Flex>
      </VStack>
    </>
  );
};

export default Homepage;
