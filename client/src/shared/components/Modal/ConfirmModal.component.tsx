import {
  Button,
  ButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

export interface ConfirmModalProps {
  onConfirm: () => void;
  onOpenChange: () => void;
  isOpen: boolean;
  head: string;
  text: string;
  confirmBtnName?: string;
  confirmBtnVariant?: ButtonProps["variant"];
  confirmBtnColor?: ButtonProps["color"];
  fullFooter?: boolean;
}

const ConfirmModal = ({
  onConfirm,
  onOpenChange,
  isOpen,
  text,
  head,
  confirmBtnName = "Confirm",
  confirmBtnVariant = "solid",
  confirmBtnColor = "primary",
  fullFooter = true,
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="block text-center">{head}</ModalHeader>
            <ModalBody>
              <p className="text-center text-neutral-500">{text}</p>
            </ModalBody>
            <ModalFooter className="flex w-full">
              <Button
                color={confirmBtnColor}
                variant={confirmBtnVariant}
                onPress={onConfirm}
                {...(fullFooter && { className: "flex-1" })}
              >
                {confirmBtnName}
              </Button>
              <Button
                color="default"
                onPress={onClose}
                {...(fullFooter && { className: "flex-1" })}
              >
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
