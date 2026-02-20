
import React, { useState } from 'react';
import { BRANCHES } from '../constants';
import { BranchId } from '../types';

interface LoginProps {
  onLogin: (email: string, branchId: BranchId) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [branchId, setBranchId] = useState<BranchId>(0);

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-darkblue rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-3xl font-bold">JB</span>
          </div>
          <h1 className="text-2xl font-bold text-darkblue">JULFERIIN B GLOBAL</h1>
          <p className="text-gray-500">Gestão Integrada de Ramos</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email do Gerente</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@julferiin.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-darkblue focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Selecionar Ramo</label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(Number(e.target.value) as BranchId)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-darkblue focus:outline-none transition-all bg-white"
            >
              {BRANCHES.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => email && onLogin(email, branchId)}
            className="w-full py-3 bg-darkblue text-white rounded-lg font-bold hover:bg-maroon transition-colors shadow-lg active:scale-95"
          >
            ENTRAR NO SISTEMA
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">&copy; 2024 JULFERIIN GLOBAL. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
