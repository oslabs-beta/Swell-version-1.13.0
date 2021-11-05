import Dexie from 'dexie';

// db.on('versionchange', (event) => {
  //   if (
    //     confirm(
      //       `Another page tries to upgrade the database to version ${event.newVersion}. Accept?`
      //     )
      //   ) {
        //     // Refresh current webapp so that it starts working with newer DB schema.
        //     return window.location.reload();
        //   }
        //   // Will let user finish its work in this window and
        //   // block the other window from upgrading.
        //   return false;
        // });
        
        // db.version(2).stores({ //---> original setup
        //   history: 'id, created_at',
        //   collections: 'id, created_at, &name',
        // });
        
        // db.version(1).stores({ //---> original setup
        //   history: 'id, created_at',
        // });
        
        class SwellDB extends Dexie {
          history: Dexie.Table<Record<string, unknown>, string>;
          
          collections: Dexie.Table<Record<string, unknown>, string>;
          
          constructor() {
            super('SwellDB');
            this.on('versionchange', (event => {
              const confirmation = confirm(`Another page tries to upgrade the database to version ${event.newVersion}. Accept?`);
              if (confirmation) {
                // Refresh current webapp so that it starts working with newer DB schema.
                return window.location.reload();
              }
              return false
            }))
            this.version(2).stores({
              history: 'id, createdAt',
              collections: 'id, createdAt, &name'
            });
            this.version(1).stores({
              history: 'id, createdAt'
            });
          }
        }
        
        const db = new SwellDB();
        
        // db.open()
        
        export default db;
        