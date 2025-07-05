// helpers/backups.js
import fs from 'fs';
import path from 'path';
import { connectClient } from './mongoCliente.js';

export default class BackUP {
  constructor() {
    this.dbName = 'SoundsInstrument';
    this.backupPath = './backup';

    if (!fs.existsSync(this.backupPath)) {
      fs.mkdirSync(this.backupPath, { recursive: true });
    }
  }

  async realizarBackup() {
    const fecha = new Date().toISOString().replace(/[:.]/g, '-');

    try {
      const client = await connectClient();
      const db = client.db(this.dbName);
      const collections = await db.listCollections().toArray();
  console.log(`Colecciones encontradas (${collections.length}):`, collections.map(c => c.name));


      console.log(`📁 Iniciando backup: ${fecha}`);

      for (const collection of collections) {
        const nombre = collection.name;
        const documentos = await db.collection(nombre).find({}).toArray();

        const filePath = path.join(this.backupPath, `backup-${nombre}-${fecha}.json`);
        fs.writeFileSync(filePath, JSON.stringify(documentos, null, 2));
        console.log(`✔️ Copia de '${nombre}' guardada en ${filePath}`);
      }

      console.log('✅ Respaldo completo.');
    } catch (error) {
      console.error('❌ Error al hacer backup:', error);
    }
  }

  limpiarBackup() {
    console.log('🧹 Limpiando backups antiguos...');
  }
}
