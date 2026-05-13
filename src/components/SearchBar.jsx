import React from 'react';

function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form className="search-bar d-flex gap-2 mb-4" onSubmit={onSubmit}>
      <input
        type="text"
        className="form-control"
        placeholder="Buscar destino, ciudad o experiencia"
        value={value}
        onChange={onChange}
      />
      <button type="submit" className="btn btn-danger">
        Buscar
      </button>
    </form>
  );
}

export default SearchBar;
