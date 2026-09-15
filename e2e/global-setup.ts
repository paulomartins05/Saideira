import { execSync } from 'child_process';

async function globalSetup() {
  console.log('🧹 Preparando o ambiente para os testes: rodando npx prisma db seed...');
  execSync('npx prisma db seed', { stdio: 'inherit' });
}

export default globalSetup;
