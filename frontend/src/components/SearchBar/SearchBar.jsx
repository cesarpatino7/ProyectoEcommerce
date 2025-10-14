import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Forzar búsqueda inmediata al enviar el formulario
        onSearch(searchTerm);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-6">
            <div className="join w-full">
                <input
                    type="text"
                    placeholder="Buscar perfumes..."
                    className="input input-bordered join-item flex-1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    type="submit"
                    className="btn join-item bg-blue-950 text-white "
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>
        </form>
    );
};

export default SearchBar;