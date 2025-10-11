import Home from "../components/Home/Home"

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="py-8">
                <h1 className="text-4xl font-bold text-center text-gray-800">Catálogo de Perfumes</h1>
                <p className="text-center text-gray-600 mt-2 mb-8">Descubre nuestra exclusiva colección de fragancias</p>
                <Home/>
            </div>
        </div>
    )
}

export default HomePage