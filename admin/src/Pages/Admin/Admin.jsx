// admin/src/Pages/Admin/Admin.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AddProduct from '../../Components/AddProduct/AddProduct';
import ListProduct from '../../Components/ListProduct/ListProduct';
import AddHero from '../../Components/AddHero/AddHero';
import ListHero from '../../Components/ListHero/ListHero';

const Admin = () => {
  return (
    <div className="admin-main">
      <Routes>
        <Route path="/" element={<Navigate to="/listproduct" replace />} />
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/listproduct" element={<ListProduct />} />
        <Route path="/addhero" element={<AddHero />} />
        <Route path="/listhero" element={<ListHero />} />
        <Route path="*" element={<Navigate to="/listproduct" replace />} />
      </Routes>
    </div>
  );
};

export default Admin;