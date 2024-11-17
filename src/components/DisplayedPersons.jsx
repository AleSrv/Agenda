import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import EyeButton from './EyeButton';
import CloseButton from './CloseButton';

const DisplayedPersons = ({ displayedPersons }) => {
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const popoverRef = useRef(null);

    const togglePopover = (person) => {
        setSelectedPerson(selectedPerson === person.posicion ? null : person.posicion);
        setIsEditing(false);
    };

    const handleClickOutside = (event) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target)) {
            setSelectedPerson(null);
            setIsEditing(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <ul style={{ position: 'relative' }}>
            {displayedPersons.map((person, index) => (
                <li
                    key={person.posicion || index} // Usa `posicion` si está definido, y el índice como respaldo.
                    onClick={() => togglePopover(person)}
                    style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '10px' }}
                >
                    <strong style={{ marginRight: '10px', display: 'inline-flex', alignItems: 'center' }}>
                        {person.posicion || '-'} - {person.name} {person.number}
                    </strong>
                    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <EyeButton />
                    </div>
                    {selectedPerson === person.posicion && (
                        <div ref={popoverRef} className="popoverDetails" style={{ marginLeft: '20px' }}>
                            <h3>Detalles de {person.name}</h3>
                            {isEditing ? (
                                // Formulario de edición
                                <div>
                                    <label>
                                        Nombre:
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            placeholder="Nuevo nombre"
                                            style={{ marginLeft: '10px' }}
                                        />
                                    </label>
                                    <label>
                                        Teléfono:
                                        <input
                                            type="text"
                                            value={editPhone}
                                            onChange={(e) => setEditPhone(e.target.value)}
                                            placeholder="Nuevo teléfono"
                                            style={{ marginLeft: '10px', marginTop: '5px' }}
                                        />
                                    </label>
                                    <button style={{ marginTop: '10px' }}>Guardar</button>
                                </div>
                            ) : (
                                // Detalles del contacto (sin editar)
                                <>
                                    <p><strong>Posición:</strong> {person.posicion}</p>
                                    <p><strong>Teléfono:</strong> {person.number}</p>
                                </>
                            )}
                            <div>
                                <button onClick={() => setSelectedPerson(null)} style={{ display: 'inline-flex', alignItems: 'center', margin: "5px" }}>
                                    <CloseButton /> Cerrar
                                </button>
                            </div>
                        </div>
                    )}
                </li>
            ))}

        </ul>
    );
};

DisplayedPersons.propTypes = {
    displayedPersons: PropTypes.arrayOf(
        PropTypes.shape({
            posicion: PropTypes.number, // Cambiado a opcional.
            name: PropTypes.string.isRequired,
            number: PropTypes.string.isRequired,
        })
    ).isRequired,
};


export default DisplayedPersons;
