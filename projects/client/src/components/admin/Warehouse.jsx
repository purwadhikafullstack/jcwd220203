import { Tr, Td, Button } from "@chakra-ui/react";

const Warehouse = ({ id, nama_warehouse, address, state, latitude, longitude, onEdit, onDelete }) => {
  const DeleteBtnHandler = () => {
    onDelete();
  };

  const editBtnHandler = () => {
    onEdit();
  }
  return (
    <>
      <Tr>
        <Td>{id}</Td>
        <Td>{nama_warehouse}</Td>
        <Td>{address}</Td>
        <Td>{state}</Td>
        {/* <Td>{latitude}</Td>
        <Td>{longitude}</Td> */}
        <Td>
          <Button
                onClick={editBtnHandler}
                colorScheme={"orange"}
                marginRight="5px"
              >
                Edit
              </Button>
          <Button onClick={DeleteBtnHandler} colorScheme={"red"}>
            Delete
          </Button>
        </Td>
      </Tr>
    </>
  );
};

export default Warehouse;
