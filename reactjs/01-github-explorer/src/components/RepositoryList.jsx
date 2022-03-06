import { RepositoryItem } from "./RepositoryItem";

export function RepositoryList() {
    return (
        <section>
            <h1>Repository List</h1>
            <ul>
                <li>
                    <RepositoryItem repository="unform" />
                </li>
            </ul>
        </section>
    )
}