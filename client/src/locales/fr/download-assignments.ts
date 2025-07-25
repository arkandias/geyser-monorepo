export default {
  downloadAssignments: {
    program: "Mention",
    track: "Parcours",
    course: "Enseignement",
    term: "Période",
    type: "Type",
    teacher: "Intervenant",
    email: "Email",
    position: "Position",
    groupsAssigned: "Groupes attribués",
    hoursAssigned: "Heures attribuées",
    hoursWeightedAssigned: "Heures éq. TD attribuées",
    courseExternalReference: "Référence externe du cours",
    error: {
      requestFailed: "La requête a échoué",
      downloadFailed: "Le téléchargement a échoué",
      unknownError: "Erreur inconnue",
    },
  },
} as const;
