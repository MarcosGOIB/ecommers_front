import React from 'react';
import { Pagination } from 'react-bootstrap';

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {

  const renderPaginationItems = () => {
    const items = [];
    
    const maxPagesToShow = 5;
    
 
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
   
    if (endPage - startPage + 1 < maxPagesToShow && startPage > 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    if (currentPage > 1) {
      items.push(
        <Pagination.First key="first" onClick={() => onPageChange(1)} />
      );
      items.push(
        <Pagination.Prev key="prev" onClick={() => onPageChange(currentPage - 1)} />
      );
    }
    
    if (startPage > 1) {
      items.push(
        <Pagination.Ellipsis key="ellipsis-start" disabled />
      );
    }
    
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }
    
    if (endPage < totalPages) {
      items.push(
        <Pagination.Ellipsis key="ellipsis-end" disabled />
      );
    }
    
    if (currentPage < totalPages) {
      items.push(
        <Pagination.Next key="next" onClick={() => onPageChange(currentPage + 1)} />
      );
      items.push(
        <Pagination.Last key="last" onClick={() => onPageChange(totalPages)} />
      );
    }
    
    return items;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="d-flex justify-content-center my-4">
      <Pagination>{renderPaginationItems()}</Pagination>
    </div>
  );
};

export default PaginationComponent;