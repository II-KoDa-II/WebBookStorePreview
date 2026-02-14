import {Routes, Route} from "react-router-dom"
import HomePage from "./pages/HomePage/HomePage"
import BookInfo from "./pages/BookInfo/BookInfo"
import SearchPage from "./pages/SearchPage/SearchPage"

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/book/:id" element={<BookInfo />} />
            <Route path="*" element={<HomePage />} />
        </Routes>
    )
}