//src\App.jsx
//npm install axios
//npm install json-server --save-dev 
//PACKAGE.JSON/SCRIPTS: "server": "json-server -p3001 --watch db.json"
//npm run server


import { useEffect, useRef, useState } from 'react';
import DisplayedPersons from './components/DisplayedPersons';
import Filter from './components/Filter';
import FormPhone from './components/FormPhone';
import axios from 'axios';

// Cargar datos iniciales desde localStorage // CAMBIO A DB JSON-SERVER
// const storedPersons = localStorage.getItem('contacts')
//   ? JSON.parse(localStorage.getItem('contacts'))
//   : [];



const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [message, setMessage] = useState({ activo: false, mostrar: '', target: '' });
  const [displayedPersons, setDisplayedPersons] = useState(persons);
  const inputRef = useRef(null);
  const phoneRef = useRef(null);
  const [searchName, setSearchName] = useState('');

  const limpiar = (setter) => setter('');

  useEffect(() => {
    // Cargar datos desde JSON Server
    axios
      .get('http://localhost:3001/persons')
      .then(response => setPersons(response.data))
      .catch(error => console.error('Error al obtener datos:', error));
  }, []);


  useEffect(() => {
    alert("falta mirar botones edicion y ver")
    inputRef.current.focus();
  }, []);

  //RENDERIZAR SI CAMBIA searchName, persons
  useEffect(() => {
    const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase()));
    setDisplayedPersons(filteredPersons);
  }, [searchName, persons]);

  //renderizar si CAMBIA message
  useEffect(() => {
    if (message.activo) {
      const timer = setTimeout(() => setMessage({ activo: false, mostrar: '', target: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // INPUT NAME , SEARCH Y PHONE
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'newName') setNewName(value);
    else if (name === 'search') setSearchName(value);
    else if (name === 'newPhone') setNewPhone(value);
  };

  //ENVIO FORMULARIO
  const handleSubmit = (e) => {
    e.preventDefault();

    if (persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
      setMessage({ activo: true, mostrar: 'El nombre ya existe', target: 'name' });
      inputRef.current.select();
      return;
    }

    if (newName === '' || newPhone === '' || Number(newPhone) < 0) {
      setMessage({ activo: true, mostrar: 'Campos inválidos', target: 'phone' });
      phoneRef.current.focus();
      return;
    }

    const newContact = { name: newName, number: newPhone };

    // Deja que JSON Server maneje el ID
    axios
      .post('http://localhost:3001/persons', newContact)
      .then(response => {
        setPersons([...persons, response.data]);
        setNewName('');
        setNewPhone('');
        setMessage({ activo: false, mostrar: '', target: '' });
      })
      .catch(error => console.error('Error al agregar contacto:', error));
  };




  return (
    <div>
      <h1>Agenda Telefónica</h1>
      <h2>Agregar nuevo número</h2>
      <FormPhone
        handleSubmit={handleSubmit}
        newName={newName}
        handleChange={handleChange}
        inputRef={inputRef}
        message={message}
        newPhone={newPhone}
        phoneRef={phoneRef}
      />
      <Filter limpiar={limpiar} setSearchName={setSearchName} searchName={searchName} handleSearch={handleChange} />
      <h2>Listado</h2>
      <DisplayedPersons displayedPersons={displayedPersons} />
    </div>
  );
};

export default App;