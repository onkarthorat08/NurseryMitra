import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './components/register';
import Login from './components/login';
import CreateNursery from "./components/create_nursery";
import Home from "./components/home";
import AddSapling from "./components/addSapling";
import ViewSaplings from "./components/viewSapling";
import EditSapling from "./components/editSapling";
import FarmerViewSaplings from "./components/FarmerviewSaplings";
import BulkUpload from "./components/BulkUpload";
import BuySapling from "./components/BuySapling";
import MyOrders from "./components/MyOrders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path='/' element={<Login />} />
        <Route path='/create_nursery' element={<CreateNursery />} />
        <Route path='/home' element={<Home />} />
        <Route path="/add-sapling" element={<AddSapling />} />
        <Route path="/view-saplings" element={<ViewSaplings />} />
        <Route path="/edit-sapling/:sapling_id" element={<EditSapling />} />
        <Route path="/saplings" element={<FarmerViewSaplings />} />
        <Route path="bulk-upload" element={<BulkUpload />} />
        <Route path="/buy-sapling/:sapling_id" element={<BuySapling />} />
        <Route path="/my-orders" element={<MyOrders />}/>

      </Routes>
    </BrowserRouter>
  );
}
export default App;