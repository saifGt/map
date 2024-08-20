export interface Loc {
    lat: number;
    lng: number;
    
  }
  
  export interface Etablissement {
    libelleEtablissement: string;
    loc: Loc;
    codeEtablissement: string;
    typeFoyer: string;
    libelleEtablissemnet : string;
    actif : string ;
    flgPedagogique: string ;
  }
  