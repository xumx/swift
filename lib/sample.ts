export const sampleData = {
  MedicalHistory:
    "Patient has a history of hypertension and Type 2 diabetes. Recently underwent hip replacement surgery at Singapore General Hospital.",
  CurrentFunctionalStatus: "Ambulatory with walking stick",
  AssessedAddress: "Block 123, Ang Mo Kio Avenue 6, #08-123, Singapore 560123",
  SocialBackground: {
    AccommodationType: "HDB 3-room flat",
    HomeSituation: ["Lives with someone", "Community Resources"],
    HomeSituationRemarks:
      "Lives with elderly spouse, receives help from nearby Senior Activity Centre",
    SocialSupport: [
      {
        Name: "Tan Ah Kow",
        Relationship: "Spouse",
        ContactNo: "91234567",
        IsSpokesperson: "Yes",
      },
      {
        Name: "Tan Mei Ling",
        Relationship: "Daughter",
        ContactNo: "98765432",
        IsSpokesperson: "No",
      },
    ],
  },
  Equipments: {
    EquipmentRequiredForHomeVisit: "Walking Aids",
    EquipmentsRequiredRemarks: "Quad cane required for stability",
    EquipmentAvailableAtHome: "Wheelchair",
    EquipmentsAvailableRemarks: "Wheelchair available for longer distances",
  },
  ExternalAccessibility: {
    AccessibilityAssessed: "Assessed",
    AccessibilityLanding: {
      LiftLandingFlat: "Lift-Landing",
      Remarks: "Lift available, but occasional breakdowns reported",
    },
    AccessibilityFlat: {
      TypeOfFlat: "Corridor Flat",
      DimensionsOfCorridor: "1.2m wide",
    },
    AccessibilityClutter: {
      PresenceOfClutter: true,
      Remarks: "Some potted plants near the entrance",
    },
    AccessibilitySpace: {
      SpaceAvailable: "Sufficient",
      WidthOfDoor: 90,
    },
    AccessibilityKerbEntrance: {
      PresenceOfKerb: true,
      Type: "End",
      Remarks: "Small kerb at entrance",
      Measurement: "2cm height",
    },
    AccessibilitySteps: {
      PresenceOfSteps: false,
    },
    OtherRemarks: "Consider installing grab bars near entrance",
  },
  LivingArea: {
    LivingAreaAssessed: "Assessed",
    LivingAreaStairs: {
      PresenceOfStairs: false,
    },
    LivingAreaRugs: {
      PresenceOfRugs: true,
      Remarks: "Non-slip rug in living room",
    },
    LivingAreaSofa: {
      PresenceOfSofa: true,
      Height: 45,
      Remarks: "Able",
    },
    LivingAreaSpace: {
      SpaceAvailable: "Sufficient",
      Remarks: "Adequate space for mobility aid maneuvering",
    },
    LivingAreaLighting: "Adequate",
    BedroomLight: true,
    OtherRemarks: "Consider rearranging furniture for easier navigation",
  },
  BathroomToilet: {
    BathroomAssessed: "Assessed",
    BathroomLocation: "Attached to bedroom",
    BathroomKerbEntrance: {
      PresenceOfKerb: true,
      Type: "Complete",
      Remarks: "Kerb at bathroom entrance",
      Measurement: "3cm height",
    },
    BathroomRugs: {
      PresenceOfRugs: false,
    },
    BathroomMats: {
      PresenceOfMats: true,
      Remarks: "Non-slip bath mat present",
    },
    BathroomShower: {
      PresenceOfShower: true,
      Remarks: "Handheld shower head installed",
    },
    BathroomToiletType: "Sitting",
    BathroomToiletHeight: 40,
    BathroomToiletRemarks: "Able",
    BathroomBars: {
      PresenceOfBars: true,
      Remarks: "Grab bars installed near toilet and shower",
    },
    BathroomSpace: {
      SpaceAvailable: "Sufficient",
    },
    BathroomLighting: {
      Lighting: "Adequate",
    },
    OtherRemarks: "Consider installing a shower chair",
  },
  Bedroom: {
    BedroomAssessed: "Assessed",
    BedroomBed: {
      PresenceOfBed: true,
      Height: 55,
      Remarks: "Able",
    },
    BedroomRugs: {
      PresenceOfRugs: false,
    },
    BedroomLighting: "Adequate",
    BedroomLight: true,
    BedroomSpace: {
      SpaceAvailable: "Sufficient",
      Remarks: "Adequate space for mobility aid beside bed",
    },
    OtherRemarks: "Consider installing bed rail for support",
  },
  Kitchen: {
    KitchenAssessed: "Assessed",
    KitchenKerb: {
      PresenceOfKerb: false,
    },
    KitchenRugs: {
      PresenceOfRugs: false,
    },
    KitchenStove: {
      PresenceOfStove: true,
      Height: 90,
      Remarks: "Induction cooktop for safety",
    },
    KitchenItemHeight: {
      PresenceOfItemHeight: true,
      Height: 150,
      Remarks: "Unable",
    },
    KitchenTable: {
      PresenceOfTable: true,
      Height: 75,
      Remarks: "Suitable height for wheelchair access",
    },
    KitchenChair: {
      PresenceOfChair: true,
      Height: 45,
      Remarks: "Able",
    },
    OtherRemarks: "Consider lowering some kitchen cabinets for easier reach",
  },
  OtherAreas: {
    OtherAreasAssessed: "Assessed",
    OtherAreasRemarks:
      "Balcony has a small step, consider adding a small ramp for accessibility",
  },
  OtherAssessments: {
    OtherAssessmentsAssessed: "Assessed",
    OtherAssessmentsRemarks:
      "Home generally well-lit and ventilated. Consider installing emergency call system.",
  },
  SubjectiveInformation: {
    NotApplicable: false,
    ClientReported:
      "Client reports difficulty reaching high cabinets and occasional dizziness when standing up quickly",
    PresenceOfPain: "Yes",
    PainDetails: {
      Location: "Lower back and right hip",
      Nature: "Dull ache",
      Severity: "4/10",
      Frequency: "Intermittent, worse in the evenings",
      PainHistory:
        "Pain started after hip surgery, gradually improving with physiotherapy",
    },
    Problems: [
      {
        MainProblems: "Difficulty accessing high cabinets in kitchen",
        Recommendations:
          "Rearrange frequently used items to lower shelves or install pull-down shelving",
      },
      {
        MainProblems: "Risk of falls due to occasional dizziness",
        Recommendations:
          "Educate on proper techniques for positional changes, consider referral to doctor for medication review",
      },
    ],
  },
  ClientFamilyEducation: {
    EducationProvidedTo: "Social Support",
    SocialSupport: ["Tan Ah Kow", "Tan Mei Ling"],
    EducationDone:
      "Educated on fall prevention strategies, proper use of mobility aids, and importance of medication adherence",
    EducationPerformance: "Competent",
    EducationPerformanceRemarks: "Family members demonstrated understanding",
    EducationFollowup: {
      FollowupNeeded: true,
      FollowupRemarks:
        "Follow up in 1 month to assess implementation of recommendations",
    },
  },
  AttachmentLink: "https://www.example.com/home-assessment-photos-123456",
};