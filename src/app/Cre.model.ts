import { Etablissement } from "./etablissement.model";



  export interface Cre {
    CodeCre : String ;
    libelleCre : String;
    loc : {
        lat: number;
        lng: number;
      };
    etab: Etablissement


  }