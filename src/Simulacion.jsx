import React from "react";

const simulaciones = [
  {
    id: 1,
    nombre: "Onboarding",
    descripcion: "Familiarízate con el entorno y las instrucciones básicas.",
    imagen: "/images/onboarding.jpg"
  },
  {
    id: 2,
    nombre: "Incendio",
    descripcion: "Simulación de evacuación en caso de incendio.",
    imagen: "/images/incendio.jpg"
  },
  {
    id: 3,
    nombre: "Simulacro",
    descripcion: "Ejercicio práctico para situaciones de emergencia.",
    imagen: "/images/simulacro.jpg"
  }
];

export default function Simulacion() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Simulación</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {simulaciones.map((sim) => (
          <div key={sim.id} className="bg-white shadow-lg rounded-lg overflow-hidden p-4">
            <div className="flex items-center">
              <img src={sim.imagen} alt={sim.nombre} className="w-24 h-24 object-cover" />
              <div className="border-l-4 border-orange-500 pl-4 ml-4">
                <h2 className="text-xl font-semibold">{sim.nombre}</h2>
                <p className="text-gray-600">{sim.descripcion}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
