document.addEventListener('DOMContentLoaded', async function () {
    await getPCsRequest();

    const savePCButton = document.getElementById('savePCButton');
    
    if (savePCButton) {
        savePCButton.addEventListener('click', async function () {
            const pcMarca = document.getElementById('Marca').value;
            const pcProcesador = document.getElementById('procesador').value;
            const pcSistemaOperativo = document.getElementById('sistema_operativo').value;
            const pcAlmacenamiento = document.getElementById('almacenamiento').value;
            const pcRAM = document.getElementById('ram').value;
            const pcEstado = document.getElementById('estado').checked;

            if (!pcMarca || !pcProcesador || !pcSistemaOperativo || !pcAlmacenamiento || !pcRAM || !pcEstado) {
                alert('Por favor, complete todos los campos antes de guardar la PC.');
                return;
            }

            await savePCRequest({ pcMarca, pcProcesador, pcSistemaOperativo, pcAlmacenamiento, pcRAM, pcEstado });
        });
    }

    const updatePCButton = document.getElementById('updatePCButton');
    updatePCButton.addEventListener('click', async function () {
        const pcID = document.getElementById('editPCId').value;
        const pcMarca = document.getElementById('editMarca').value;
        const pcProcesador = document.getElementById('editProcesador').value;
        const pcSistemaOperativo = document.getElementById('editSistemaOperativo').value;
        const pcAlmacenamiento = document.getElementById('editAlmacenamiento').value;
        const pcRAM = document.getElementById('editRAM').value;
        const pcEstado = document.getElementById('editEstado').checked;

        if (!pcMarca || !pcProcesador || !pcSistemaOperativo || !pcAlmacenamiento || !pcRAM || !pcEstado) {
           
            alert('Por favor, complete todos los campos antes de actualizar la PC.');
            return;
        }

        await updatePCRequest({ pcID, pcMarca, pcProcesador, pcSistemaOperativo, pcAlmacenamiento, pcRAM, pcEstado });
    });

    const deletePCButton = document.getElementById('deletePCButton');
    deletePCButton.addEventListener('click', async function () {
        const pcId = document.getElementById('deletePCId').innerHTML;
        await deletePCRequest(pcId);
    });

    const detailsPCButtons = document.getElementById('detailsPCButton');
    detailsPCButtons.addEventListener('click', async function () {
        const pcId = detailsPCButtons.getElementById('pcDetailsContent');
        await showPCDetails(pcId);
    });
});


function showPCs(pcs) {
    let arrayPCs = '';

    if (!!pcs && pcs.length > 0) {
        pcs.forEach(pc => {
            arrayPCs += `
                <div class="card mb-3 container-fluid">
                    <div class="card-body">
                        <h5 class="card-title">PC ID: ${pc.id}</h5>
                        <p class="card-text">Marca: ${pc.marca}</p>
                        <p class="card-text">Procesador: ${pc.procesador}</p>
                        <p class="card-text">Sistema Operativo: ${pc.sistema_operativo}</p>
                        <p class="card-text">Almacenamiento: ${pc.almacenamiento}</p>
                        <p class="card-text">RAM: ${pc.ram}</p>
                        <p class="card-text">Estado: ${pc.estado ? 'Activo' : 'Inactivo'}</p>
                        
                        <div class="d-flex justify-content-end">
                            <button type="button" class="btn btn-outline-success me-2" onclick="editPC('${pc.id}', '${pc.marca}', '${pc.procesador}', '${pc.sistema_operativo}', '${pc.procesador}', '${pc.almacenamiento}','${pc.procesador}', '${pc.ram}', '${pc.estado}')">
                                <i class="bi bi-pencil"></i> Editar
                            </button>
                            <button type="button" class="btn btn-outline-danger me-2" onclick="deletePC('${pc.id}', '${pc.marca}')">
                                <i class="bi bi-trash"></i> Eliminar
                            </button>
                            <button type="button" class="btn btn-outline-primary details-pc-button" onclick="pcDetails('${pc.id}', '${pc.marca}', '${pc.procesador}', '${pc.sistema_operativo}', '${pc.procesador}', '${pc.almacenamiento}','${pc.procesador}', '${pc.ram}','${pc.estado}')">
                                <i class="bi bi-info"></i> Detalles
                            </button>
                        </div>
                    </div>
                </div>`;
        });
    } else {
        arrayPCs = `
            <div class="card mb-3 container-fluid">
                <div class="card-body">
                    <p class="card-text text-center">No hay PCs</p>
                </div>
            </div>`;
    }

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = arrayPCs;
}



async function getPCsRequest() {
    try {
        let response = await fetch('http://localhost:3000/pcs');
        let data = await response.json();
        showPCs(data);
    } catch (error) {
        console.log(error);
        showPCs(null);
    }
}

async function savePCRequest({ pcMarca, pcProcesador, pcSistemaOperativo, pcAlmacenamiento, pcRAM, pcEstado }) {
    try {
        console.log('Enviando solicitud para agregar PC...');
        let request = await fetch('http://localhost:3000/pcs', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                marca: pcMarca,
                procesador: pcProcesador,
                sistema_operativo: pcSistemaOperativo,
                almacenamiento: pcAlmacenamiento,
                ram: pcRAM,
                estado: pcEstado
            })
        });
        
        let data = await request.json();

        if (data.ok) {
            alert('PC creada exitosamente');
            hideModal('pcModal');
            location.reload();
        } else {
            alert('No se pudo crear la PC');
        }
    } catch (error) {
        
        alert('ERROR');
    }
}


// Nueva función para mostrar la nueva PC
function showNewPC(pc) {
    const tableBody = document.getElementById('tableBody');

    // Crear la nueva tarjeta
    const newCard = document.createElement('div');
    newCard.classList.add('card', 'mb-3', 'container-fluid');
    newCard.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">PC ID: ${pc.id}</h5>
            <p class="card-text">Marca: ${pc.marca}</p>
            <p class="card-text">Procesador: ${pc.procesador}</p>
            <p class="card-text">Sistema Operativo: ${pc.sistema_operativo}</p>
            <p class="card-text">Almacenamiento: ${pc.almacenamiento}</p>
            <p class="card-text">RAM: ${pc.ram}</p>
            <p class="card-text">Estado: ${pc.estado ? 'Activo' : 'Inactivo'}</p>
            
            <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-outline-success me-2" onclick="editPC('${pc.id}', '${pc.marca}', '${pc.procesador}', '${pc.sistema_operativo}', '${pc.procesador}', '${pc.almacenamiento}','${pc.procesador}', '${pc.ram}', '${pc.estado}')">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button type="button" class="btn btn-outline-danger me-2" onclick="deletePC('${pc.id}', '${pc.marca}')">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
                <button type="button" class="btn btn-outline-primary details-pc-button" onclick="pcDetails('${pc.id}', '${pc.marca}', '${pc.procesador}', '${pc.sistema_operativo}', '${pc.procesador}', '${pc.almacenamiento}','${pc.procesador}', '${pc.ram}','${pc.estado}')">
                    <i class="bi bi-info"></i> Detalles
                </button>
            </div>
        </div>`;

    // Agregar la nueva tarjeta al cuerpo de la página
    tableBody.prepend(newCard);
}


async function updatePCRequest({ pcID, pcMarca, pcProcesador, pcSistemaOperativo, pcAlmacenamiento,  pcRAM, pcEstado }) {
    try {
        let request = await fetch(`http://localhost:3000/pcs/${pcID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                marca: pcMarca,
                procesador: pcProcesador,
                sistema_operativo: pcSistemaOperativo,
                almacenamiento: pcAlmacenamiento,
                ram: pcRAM,
                estado: pcEstado
            })
        });
        const data = await request.json();

        if (data.ok) {
            alert('PC actualizada con éxito');
            hideModal('editPCModal');
            location.reload();
        } else {
            alert('No se pudo actualizar la PC');
        }
    } catch (error) {
        alert('ERROR');
    }
}

function editPC(id, marca, procesador, sistema_operativo, almacenamiento, ram, estado) {
    console.log('Edit PC button clicked');
    document.getElementById('editPCId').value = id;
    document.getElementById('editMarca').value = marca;
    document.getElementById('editProcesador').value = procesador;
    document.getElementById('editSistemaOperativo').value = sistema_operativo;
    document.getElementById('editAlmacenamiento').value = almacenamiento;
    document.getElementById('editRAM').value = ram;
    document.getElementById('editEstado').checked = estado;
    showModal('editPCModal');
}

function deletePC(id, marca) {
    document.getElementById('deletePCId').innerHTML = id;
    document.getElementById('deletePCMarca').innerHTML = marca;
    showModal('deletePCModal');
}

async function deletePCRequest(id) {
    try {
        let request = await fetch(`http://localhost:3000/pcs/${id}`, {
            'method': 'DELETE'
        });
        let data = await request.json();
        if (data.ok) {
            alert('PC eliminada correctamente');
            hideModal('deletePCModal');
            location.reload();
        } else {
            alert('Eliminación fallida de la PC');
        }
    } catch (error) {
        alert('ERROR');
    }
}

function showPC(pc) {
    const pcDetailsContent = document.getElementById('pcDetailsContent');

    // Crear la tarjeta
    const card = document.createElement('div');
    card.classList.add('card', 'mb-3');

    // Crear la imagen y establecer la fuente correctamente
    const image = document.createElement('img');
    image.src = pc.imagen; // Asegúrate de que pc.imagen contenga la URL correcta de la imagen
    image.classList.add('card-img-top', 'pc-image'); // Agregar la clase pc-image
    image.alt = `Imagen de la PC ${pc.id}`;
    image.style = "width: 300px;"

    // Crear el cuerpo de la tarjeta
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    cardBody.innerHTML = `
    <div class="col-md-8">
        <div class="card-body">
        <h5 class="card-title">PC ID: ${pc.id}</h5>
        <p class="card-text">Marca: ${pc.marca}</p>
        <p class="card-text">Procesador: ${pc.procesador}</p>
        <p class="card-text">Sistema Operativo: ${pc.sistema_operativo}</p>
        <p class="card-text">Almacenamiento: ${pc.almacenamiento}</p>
        <p class="card-text">RAM: ${pc.ram}</p>
        <p class="card-text">Estado: ${pc.estado}</p>
    `;

    // Agregar la imagen y el cuerpo a la tarjeta
    card.appendChild(image);
    card.appendChild(cardBody);

    // Agregar la tarjeta al contenido de detalles de la PC
    pcDetailsContent.appendChild(card);
}

async function pcDetails(id) {
    try {
        let request = await fetch(`http://localhost:3000/pcs/${id}`, {
            method: 'GET'
        });
        let data = await request.json();
        if (data.ok) {
            alert('PC obtenida correctamente');
            showPC(data.pc);
            showModal('pcDetailsModal');
        } else {
            alert('Obtención de PC fallida');
        }
    } catch (error) {
        console.log(error);
        alert('ERROR');
    }
}

function showModal(idModal) {
    const myModal = new bootstrap.Modal(`#${idModal}`, {
        keyboard: false
    });
    myModal.show();
}

function hideModal(modalId) {
    const existingModal = document.getElementById(modalId);
    const modal = new bootstrap.Modal(existingModal);
    modal.hide();
}   
