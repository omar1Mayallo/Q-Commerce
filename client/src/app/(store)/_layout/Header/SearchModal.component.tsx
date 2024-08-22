import React, { useState } from "react";
import { Modal, ModalContent, Input } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import StarRating from "@/shared/components/others/StarRating";

const mockProducts = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    discount: 10,
    rating: 4.5,
    image: "https://placehold.co/100",
  },
  {
    id: 2,
    name: "Product 2",
    price: 200,
    discount: 20,
    rating: 4.0,
    image: "https://placehold.co/100",
  },
  {
    id: 3,
    name: "Product 3",
    price: 300,
    discount: 30,
    rating: 4.8,
    image: "https://placehold.co/100",
  },
  {
    id: 4,
    name: "Product 4",
    price: 400,
    discount: 15,
    rating: 2.1,
    image: "https://placehold.co/100",
  },
  {
    id: 5,
    name: "Product 5",
    price: 500,
    discount: 5,
    rating: 3.8,
    image: "https://placehold.co/100",
  },
  {
    id: 6,
    name: "Product 6",
    price: 600,
    discount: 25,
    rating: 4.9,
    image: "https://placehold.co/100",
  },
];

const SearchModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [query, setQuery] = useState("");

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="fixed inset-0 flex items-center justify-center z-50"
      size="full"
    >
      <ModalContent
        className="relative w-full h-full flex flex-col items-center justify-start p-8 bg-opacity-60 backdrop-blur-sm"
        style={{ backdropFilter: "blur(5px)" }}
      >
        <div className="w-full max-w-md mt-10">
          <Input
            autoFocus
            placeholder="Search..."
            endContent={
              <FaSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            className="w-full text-center text-2xl py-4"
            variant="bordered"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="w-full max-w-md mt-6 overflow-y-auto">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="flex items-center p-4 border-b">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 mr-4"
                />
                <div className="flex flex-col">
                  <span className="font-semibold">{product.name}</span>
                  <span>Price: ${product.price}</span>
                  <span>Discount: ${product.discount}</span>
                  <StarRating rating={product.rating} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center mt-10">No results found</p>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};

export default SearchModal;
