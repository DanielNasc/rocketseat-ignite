import { useState, useEffect } from 'react';
import { RepositoryItem } from "./RepositoryItem";

import "../styles/repositoryList.scss";

const repository = {
    name: "unform",
    description: "Forms in React",
    link: "https://github.com/unform/unform",
}

export function RepositoryList() {
    const [repositories, setRepositories] = useState([]);

    useEffect(() => {
        fetch("https://api.github.com/users/danielnasc/repos")
            .then(response => response.json())
            .then(data => setRepositories(data))
    }, [repositories])

    return (
        <section className="repository-list">
            <h1>Repository List</h1>
            <ul>
               {
                   repositories.map(repository => {
                       return <RepositoryItem key={repository.name} repository={repository} />
                   })
               }
            </ul>
        </section>
    )
}