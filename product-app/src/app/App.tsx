import { Navigate, Route, Routes } from 'react-router-dom'
import CreateProduct from '../features/products/pages/CreateProduct'
import ProductDetail from '../features/products/pages/ProductDetail'
import Products from '../features/products/pages/Products'
import NotFound from '../features/shared/components/NotFound'
import Layout from '../features/shared/layout/Layout'
import '../App.css'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<CreateProduct />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}