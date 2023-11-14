document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/pcs')
        .then(response => response.json())
        .then(json => showPCs(json))
        .catch(function(error) {
            console.log(error);
        });
});

function showPCs(pcs) {
    // Filtrar solo las PCs con estado activo
    const activePCs = pcs.filter(pc => pc.estado);

    let arrayPCs = '';

    if (!!activePCs && activePCs.length > 0) {
        activePCs.forEach(pc => {
            arrayPCs += `
                <div class="card mb-3 container-fluid">
                    <div class="row">
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">PC ID: ${pc.id}</h5>
                                <p class="card-text">Marca: ${pc.marca}</p>
                                <p class="card-text">Procesador: ${pc.procesador}</p>
                                <p class="card-text">Sistema Operativo: ${pc.sistema_operativo}</p>
                                <p class="card-text">Almacenamiento: ${pc.almacenamiento}</p>
                                <p class="card-text">RAM: ${pc.ram}</p>
                                <p class="card-text">Estado: ${pc.estado ? 'Activo' : 'Inactivo'}</p>
                            </div>
                        </div>
                        <div class="col-md-4 d-flex align-items-center justify-content-center">
                            <!-- Agregar la imagen con dimensiones específicas -->
                            <img src="${pc.imagen}" alt="Imagen de la PC" class="img-fluid" style="max-width: 200px; height: auto;">
                        </div>
                    </div>
                </div>`;
        });
    } else {
        arrayPCs = `
            <div class="card mb-3 container-fluid">
                <div class="card-body">
                    <p class="card-text text-center">No hay PCs activas</p>
                </div>
            </div>`;
    }

    const PCsContainer = document.getElementById('PCs-container');
    PCsContainer.innerHTML = arrayPCs;
}
