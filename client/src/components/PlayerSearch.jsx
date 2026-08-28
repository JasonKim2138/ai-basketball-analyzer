import { useState } from "react";

function PlayerSearch({ onSearch }) {
    const [searchName, setSearchName] = useState("");
    const [gradeFilter, setGradeFilter] = useState("");

    return (
        <div className="search-card">

            <div className="search-controls">

                <input
                    type="text"
                    placeholder="Search player..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />

                <select
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value)}
                >
                    <option value="">All Grades</option>
                    <option value="S+">S+</option>
                    <option value="S">S</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                </select>

                <button
                    className="search-button"
                    onClick={() => onSearch(searchName, gradeFilter)}
                >
                    Search
                </button>

            </div>

        </div>
    );
}

export default PlayerSearch;