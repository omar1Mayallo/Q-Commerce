import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { Button } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";

const mockCartItems = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    discount: 10,
    quantity: 1,
    image: "https://placehold.co/400",
  },
  {
    id: 2,
    name: "Product 2",
    price: 200,
    discount: 20,
    quantity: 2,
    image: "https://placehold.co/400",
  },
  {
    id: 3,
    name: "Product 3",
    price: 300,
    discount: 30,
    quantity: 3,
    image: "https://placehold.co/400",
  },
  {
    id: 4,
    name: "Product 4",
    price: 400,
    discount: 40,
    quantity: 4,
    image: "https://placehold.co/400",
  },
  {
    id: 5,
    name: "Product 5",
    price: 500,
    discount: 50,
    quantity: 5,
    image: "https://placehold.co/400",
  },
];

const CartDrawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const totalWithDiscounts = mockCartItems.reduce(
    (total, item) => total + item.price * item.quantity - item.discount,
    0
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="fixed top-0 right-0 h-full bg-white shadow-lg z-50"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              style={{ width: "300px" }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-title"
              tabIndex={-1}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 id="cart-title" className="text-xl font-semibold">
                    Cart
                  </h2>
                  <button
                    onClick={onClose}
                    aria-label="Close cart"
                    className="cursor-pointer"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {mockCartItems.length > 0 ? (
                    mockCartItems.map((item) => (
                      <div key={item.id} className="flex items-center mb-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 mr-4"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold">{item.name}</span>
                          <span>Price: ${item.price}</span>
                          <span>Discount: ${item.discount}</span>
                          <div className="flex items-center mt-2">
                            <button className="border px-2" onClick={() => {}}>
                              {" "}
                              -{" "}
                            </button>
                            <span className="px-2">{item.quantity}</span>
                            <button className="border px-2" onClick={() => {}}>
                              {" "}
                              +{" "}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">Your cart is empty</p>
                    </div>
                  )}
                </div>
                <div className="border-t p-4">
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">Totals</span>
                    <span>${totalWithDiscounts}</span>
                  </div>
                  <Button
                    as="a"
                    href="/cart"
                    color="primary"
                    className="w-full"
                  >
                    Go To Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;
