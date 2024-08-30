export interface LoginResponseDto {
    message: string;
    codeEtablissement: string;
    nomEtablissement: string;
    roleUser: string; 
    withPwd: boolean;
    connected: boolean;
    codeCre: string;
    nombreDeConnexion: number;
    token: string;
    cre:any
  }