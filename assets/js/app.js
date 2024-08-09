//Autores Julio Neves, Victor Novaes, Eliel Godoy, Juan Farias, João Pedro, Victor Roma

class Person {
    constructor(id, name, age) {
        this.id = id;
        this.name = name;
        this.age = age;
    }
}

class PersonService {
    constructor() {
        this.people = [];
        this.currentId = 1;
    }

    createPerson(name, age) {
        const person = new Person(this.currentId++, name, age);
        this.people.push(person);
        return person;
    }

    getAllPeople() {
        return this.people;
    }

    getPersonById(id) {
        return this.people.find(person => person.id === id);
    }

    updatePerson(id, newName, newAge) {
        const person = this.getPersonById(id);
        if (person) {
            person.name = newName;
            person.age = newAge;
        }
        return person;
    }

    deletePerson(id) {
        this.people = this.people.filter(person => person.id !== id);
    }
}

class Page {
    constructor(content) {
        this.content = content;
    }

    render() {
        document.getElementById('content').innerHTML = this.content;
    }
}

// Instância do serviço que gerencia as pessoas
const personService = new PersonService();

// Função para criar a página de listagem
function createListPage() {
    const people = personService.getAllPeople();
    const listItems = people.map(person => `
        <li>
            ${person.name} (${person.age} anos)
            <button data-id="${person.id}" class="edit-btn">Editar</button>
            <button data-id="${person.id}" class="delete-btn">Excluir</button>
        </li>
    `).join('');

    const content = `
        <h2>Listar Pessoas</h2>
        <ul>${listItems}</ul>
    `;

    const listPage = new Page(content);
    listPage.render();

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            createEditPage(id);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            personService.deletePerson(id);
            createListPage();
        });
    });
}

// Função para criar a página de adição de pessoa
function createCreatePage() {
    const content = `
        <h2>Adicionar Pessoa</h2>
        <form id="create-person-form">
            <label for="name">Nome:</label>
            <input type="text" id="name" name="name" required>
            <label for="age">Idade:</label>
            <input type="number" id="age" name="age" required>
            <button type="submit">Adicionar</button>
        </form>
    `;

    const createPage = new Page(content);
    createPage.render();

    document.getElementById('create-person-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const age = parseInt(e.target.age.value);
        personService.createPerson(name, age);
        createListPage();
    });
}

// Função para criar a página de edição de pessoa
function createEditPage(id) {
    const person = personService.getPersonById(id);
    if (!person) return createListPage(); // Redireciona para a listagem se a pessoa não for encontrada

    const content = `
        <h2>Editar Pessoa</h2>
        <form id="edit-person-form">
            <label for="name">Nome:</label>
            <input type="text" id="name" name="name" value="${person.name}" required>
            <label for="age">Idade:</label>
            <input type="number" id="age" name="age" value="${person.age}" required>
            <button type="submit">Salvar</button>
        </form>
    `;

    const editPage = new Page(content);
    editPage.render();

    document.getElementById('edit-person-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = e.target.name.value;
        const newAge = parseInt(e.target.age.value);
        personService.updatePerson(id, newName, newAge);
        createListPage();
    });
}

// Função para gerenciar a navegação
function navigate(page) {
    if (page === 'list') {
        createListPage();
    } else if (page === 'create') {
        createCreatePage();
    }
}

// Adicionando eventos aos links de navegação
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.getAttribute('data-page');
        navigate(page);
    });
});

// Renderizando a página de listagem por padrão
navigate('list');


