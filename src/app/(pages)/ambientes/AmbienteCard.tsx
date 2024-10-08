import React from 'react';

interface AmbienteCardProps {
    nome: string;
    tipo: string;
    onClick: () => void;
}

const AmbienteCard: React.FC<AmbienteCardProps> = ({ nome, tipo, onClick }) => (
    <div
      className="bg-cinza w-80 h-14 rounded-2xl drop-shadow-md cursor-pointer flex flex-col justify-center"
      onClick={onClick}
    >
      <h2 className="px-5 text-branco text-base max-w-[30ch] truncate">{nome}</h2>
      <p className="px-5 text-xs text-subtitulo">{tipo}</p>
    </div>
  );

export default AmbienteCard;