"use client";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath: string;
}

/**
 * Client-side Pagination component
 * Enhanced for better visual clarity between current and other pages
 */
export default function Pagination({
    currentPage,
    totalPages,
    basePath
}: PaginationProps) {
    const pageNumbers = [];
    const maxPageButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const navigateToPage = (page: number) => {
        window.location.href = `${basePath}?page=${page}`;
    };

    return (
        <div className="pagination" role="navigation" aria-label="Pagination Navigation">
            <button
                className="pageButton"
                onClick={() => navigateToPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Go to previous page"
                title="Previous page"
            >
                <span aria-hidden="true">&lt;</span>
            </button>

            {startPage > 1 && (
                <>
                    <button
                        className={`pageButton ${currentPage === 1 ? 'active' : ''}`}
                        onClick={() => navigateToPage(1)}
                        aria-label="Go to page 1"
                        aria-current={currentPage === 1 ? "page" : undefined}
                    >
                        1
                    </button>
                    {startPage > 2 && <span className="paginationEllipsis" aria-hidden="true">•••</span>}
                </>
            )}

            {pageNumbers.map(number => (
                <button
                    key={number}
                    className={`pageButton ${currentPage === number ? 'active' : ''}`}
                    onClick={() => navigateToPage(number)}
                    aria-label={`Go to page ${number}`}
                    aria-current={currentPage === number ? "page" : undefined}
                >
                    {number}
                </button>
            ))}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="paginationEllipsis" aria-hidden="true">•••</span>}
                    <button
                        className={`pageButton ${currentPage === totalPages ? 'active' : ''}`}
                        onClick={() => navigateToPage(totalPages)}
                        aria-label={`Go to page ${totalPages}`}
                        aria-current={currentPage === totalPages ? "page" : undefined}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                className="pageButton"
                onClick={() => navigateToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Go to next page"
                title="Next page"
            >
                <span aria-hidden="true">&gt;</span>
            </button>
        </div>
    );
}
