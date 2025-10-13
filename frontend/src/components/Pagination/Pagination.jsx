const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePageClick = (pageNumber) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      onPageChange(pageNumber);
    }
  };

  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center my-8">
      <div className="join">
        <button
          className="join-item btn"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 0}
        >
          «
        </button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            className={`join-item btn ${
              currentPage === number ? "btn-active" : ""
            }`}
            onClick={() => handlePageClick(number)}
          >
            {number + 1}
          </button>
        ))}

        <button
          className="join-item btn"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
