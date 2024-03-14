import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateCabinForm from "./CreateCabinForm";

function AddCabin() {
  return (
    <Modal>
      <Modal.Open opens="cabin-form">
        <Button>Add new cabin</Button>
      </Modal.Open>
      <Modal.Window name="cabin-form">
        <CreateCabinForm />
      </Modal.Window>
    </Modal>
  );
}

// function AddCabin() {
//   const [isOpenModal, setIsOpenModal] = useState(false);

//   return (
//     <div>
//       <Button onClick={() => setIsOpenModal((show) => !show)}>
//         Add New Cabin
//       </Button>
//       {isOpenModal && (
//         <Modal onClose={() => setIsOpenModal((show) => !show)}>
//           <CreateCabinForm
//             onCloseModal={() => setIsOpenModal((show) => !show)}
//           />
//         </Modal>
//       )}
//     </div>
//   );
// }

export default AddCabin;
