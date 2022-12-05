import { Tr, Td, Button } from "@chakra-ui/react";

const Warehouse = ({ id, warehouse_name, full_address, address_labels, province, city, districts, username, latitude, longitude, onEdit, onDelete }) => {
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
        <Td>{warehouse_name}</Td>
        <Td>{full_address}</Td>
        <Td>{province}</Td>
        <Td>{city}</Td>
        <Td>{districts}</Td>
        <Td>{username ? username : "Not assigned"}</Td>
        {/* <Td>{latitude}</Td>
        <Td>{longitude}</Td> */}
        <Td>
          <Button
                onClick={editBtnHandler}
                colorScheme={"orange"}
                marginRight="5px"
                width="100px"
              >
                Edit
              </Button>
          <Button onClick={DeleteBtnHandler} colorScheme={"red"} width="100px">
            Delete
          </Button>
        </Td>
      </Tr>
    </>
  );
};

export default Warehouse;
