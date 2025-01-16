const express = require("express");

const app = express();
app.use(express.json());

const PORT = 3001;

let persons = require("./persons.json");

app.get("/info", (request, response) => {
    response.send(`
        <div>
            <p>Phonebook has info for ${persons.length} people.</p>
            <p>${new Date().toTimeString()}</p>
        </div>
    `);
});

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id;
    const person = persons.find(person => person.id == id);
    if (!person) {
        return response.status(404).end();
    }
    response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
    const id = parseInt(request.params.id);
    persons = persons.filter(person => person.id !== id);

    response.status(204).end();
});

app.post("/api/persons", (request, response) => {
    const person = request.body;

    if (typeof person.name !== "string" || typeof person.number !== "string") {
        return response.status(400).json({ error: "Malformed data." });
    }

    if (persons.find(entry => entry.name === person.name)) {
        return response.status(400).json({ error: "Name must be unique" });
    }

    const newPerson = {
        id: generateId(),
        name: person.name,
        number: person.number
    };
    persons = persons.concat([newPerson]);
    response.json(newPerson);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

function generateId() {
    let id;
    do id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    while (persons.find(entry => entry.id === id));
    return id;
}
