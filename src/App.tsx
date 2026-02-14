import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "./common.css"
import { BrowserRouter } from "react-router-dom"
import AppRouter from './Routes'
import Header from "./components/Header/Header"

export default function App() {
    return(
    <>
        <BrowserRouter>
            <Header />
            <div className="mainBody">
                <AppRouter />
            </div>
        </BrowserRouter>
    </>
    )
}