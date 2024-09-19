export const FormSchema  = {
	"$schema": "http://json-schema.org/draft-07/schema#",
	"title": "Form Data",
	"type": "object",
	"properties": {
	  "MedicalHistory": {
		"type": "string",
		"description": "Medical history of the patient"
	  },
	  "CurrentFunctionalStatus": {
		"type": "string",
		"maxLength": 50
	  },
	  "AssessedAddress": {
		"type": "string"
	  },
	  "SocialBackground": {
		"type": "object",
		"properties": {
		  "AccommodationType": {
			"type": "string",
			"maxLength": 50
		  },
		  "HomeSituation": {
			"type": "array",
			"items": {
			  "type": "string",
			  "enum": [
				"Lives alone",
				"Lives alone in daytime",
				"Lives with someone",
				"Community Resources"
			  ]
			}
		  },
		  "HomeSituationRemarks": {
			"type": "string",
			"maxLength": 100
		  },
		  "SocialSupport": {
			"type": "array",
			"items": {
			  "type": "object",
			  "properties": {
				"Name": { "type": "string" },
				"Relationship": { "type": "string" },
				"ContactNo": { "type": "string" },
				"IsSpokesperson": { "type": "string" }
			  },
			  "required": ["Name", "Relationship", "ContactNo", "IsSpokesperson"]
			}
		  }
		},
		"required": ["AccommodationType", "HomeSituation"]
	  },
	  "Equipments": {
		"type": "object",
		"properties": {
		  "EquipmentRequiredForHomeVisit": {
			"type": "string",
			"enum": ["NIL", "Wheelchair", "Walking Aids", "Others"]
		  },
		  "EquipmentsRequiredRemarks": {
			"type": "string",
			"maxLength": 100
		  },
		  "EquipmentAvailableAtHome": {
			"type": "string",
			"enum": ["NIL", "Wheelchair", "Walking Aids", "Others"]
		  },
		  "EquipmentsAvailableRemarks": {
			"type": "string",
			"maxLength": 100
		  }
		}
	  },
	  "ExternalAccessibility": {
		"type": "object",
		"properties": {
		  "AccessibilityAssessed": {
			"type": "string",
			"enum": ["Assessed", "Not Applicable"]
		  },
		  "AccessibilityLanding": {
			"type": "object",
			"properties": {
			  "LiftLandingFlat": {
				"type": "string",
				"enum": ["Lift-Landing", "Non Lift-Landing", "Not Applicable"]
			  },
			  "Remarks": { "type": "string", "maxLength": 100 }
			}
		  },
		  "AccessibilityFlat": {
			"type": "object",
			"properties": {
			  "TypeOfFlat": {
				"type": "string",
				"enum": ["Corner Flat", "Corridor Flat"]
			  },
			  "DimensionsOfCorridor": { "type": "string", "maxLength": 100 }
			}
		  },
		  "AccessibilityClutter": {
			"type": "object",
			"properties": {
			  "PresenceOfClutter": { "type": "boolean" },
			  "Remarks": { "type": "string", "maxLength": 100 }
			}
		  },
		  "AccessibilitySpace": {
			"type": "object",
			"properties": {
			  "SpaceAvailable": {
				"type": "string",
				"enum": ["Sufficient", "Insufficient"]
			  },
			  "WidthOfDoor": { "type": "number" }
			}
		  },
		  "AccessibilityKerbEntrance": {
			"type": "object",
			"properties": {
			  "PresenceOfKerb": { "type": "boolean" },
			  "Type": { "type": "string", "enum": ["Complete", "End"] },
			  "Remarks": { "type": "string", "maxLength": 100 },
			  "Measurement": { "type": "string", "maxLength": 100 }
			}
		  },
		  "AccessibilitySteps": {
			"type": "object",
			"properties": {
			  "PresenceOfSteps": { "type": "boolean" },
			  "NumberOfSteps": { "type": "number" },
			  "Dimensions": { "type": "number" }
			}
		  },
		  "OtherRemarks": { "type": "string", "maxLength": 100 }
		}
	  },
	  "LivingArea": {
		"type": "object",
		"properties": {
		  "LivingAreaAssessed": {
			"type": "string",
			"enum": ["Assessed", "Not Applicable"]
		  },
		  "LivingAreaStairs": {
			"type": "object",
			"properties": {
			  "PresenceOfStairs": { "type": "boolean" },
			  "NumberOfSteps": { "type": "number" },
			  "DimensionsOfSteps": { "type": "number" }
			}
		  },
		  "LivingAreaRugs": {
			"type": "object",
			"properties": {
			  "PresenceOfRugs": { "type": "boolean" },
			  "Remarks": { "type": "string", "maxLength": 100 }
			}
		  },
		  "LivingAreaSofa": {
			"type": "object",
			"properties": {
			  "PresenceOfSofa": { "type": "boolean" },
			  "Height": { "type": "number" },
			  "Remarks": { "type": "string", "enum": ["Able", "Unable"] }
			}
		  },
		  "LivingAreaSpace": {
			"type": "object",
			"properties": {
			  "SpaceAvailable": {
				"type": "string",
				"enum": ["Sufficient", "Insufficient"]
			  },
			  "Remarks": { "type": "string", "maxLength": 100 }
			}
		  },
		  "OtherRemarks": { "type": "string", "maxLength": 100 }
		}
	  },
	  "BathroomToilet": {
		"type": "object",
		"properties": {
		  "BathroomAssessed": {
			"type": "string",
			"enum": ["Assessed", "Not Applicable"]
		  },
		  "BathroomLocation": { "type": "string", "maxLength": 100 },
		  "BathroomKerbEntrance": {
			"type": "object",
			"properties": {
			  "PresenceOfKerb": { "type": "boolean" },
			  "Type": { "type": "string", "enum": ["Complete", "End"] },
			  "Remarks": { "type": "string", "maxLength": 100 },
			  "Measurement": { "type": "string", "maxLength": 100 }
			}
		  },
		  "BathroomRugs": {
			"type": "object",
			"properties": {
			  "PresenceOfRugs": { "type": "boolean" },
			  "Remarks": { "type": "string", "maxLength": 100 }
			}
		  },
		  "BathroomMats": {
			"type": "object",
			"properties": {
			  "PresenceOfMats": { "type": "boolean" },
			  "Remarks": { "type": "string", "maxLength": 100 }
			}
		  },
		  "BathroomKerb": {
			"type": "object",
			"properties": {
			  "PresenceOfKerb": { "type": "boolean" },
			  "Type": { "type": "string", "enum": ["Complete", "End"] },
			  "Remarks": { "type": "string", "maxLength": 100 },
			  "Measurement": { "type": "string", "maxLength": 100 }
			}
		  },
		  "BathroomShower": {
			"type": "object",
			"properties": {
			  "PresenceOfShower": { "type": "boolean" },
			  "Remarks": { "type": "string", "maxLength": 100 }
			}
		  },
		  "BathroomToiletType": {
			"type": "string",
			"enum": ["Squatting", "Sitting"]
		  },
		  "BathroomToiletHeight": { "type": "number" },
		  "BathroomToiletRemarks": {
			"type": "string",
			"enum": ["Able", "Unable"]
		  },
		  "BathroomBars": {
			"type": "object",
			"properties": {
			  "PresenceOfBars": { "type": "boolean" },
			  "Remarks": { "type": "string", "maxLength": 100 }
			}
		  },
		  "BathroomSpace": {
			"type": "object",
			"properties": {
			  "SpaceAvailable": {
				"type": "string",
				"enum": ["Sufficient", "Insufficient"]
			  }
			}
		  },
		  "BathroomLighting": {
			"type": "object",
			"properties": {
			  "Lighting": {
				"type": "string",
				"enum": ["Adequate", "Inadequate"]
			  }
			}
		  },
		  "OtherRemarks": { "type": "string", "maxLength": 100 }
		}
	  },
	  "Bedroom": {
		"type": "object",
		"properties": {
		  "BedroomAssessed": {
			"type": "string",
			"enum": ["Assessed", "Not Applicable"]
		  },
		  "BedroomBed": {
			"type": "object",
			"properties": {
			  "PresenceOfBed": { "type": "boolean" },
			  "Height": { "type": "number" },
			  "Remarks": { "type": "string", "enum": ["Able", "Unable"] }
			}
		  },
		  "BedroomRugs": {
			"type": "object",
			"properties": {
			  "PresenceOfRugs": { "type": "boolean" },
			  "Remarks": { "type": "string", "maxLength": 100 }
			}
		  },
		  "BedroomLighting": {
			"type": "string",
			"enum": ["Adequate", "Inadequate"]
		  },
		  "BedroomLight": { "type": "boolean" },
		  "BedroomSpace": {
			"type": "object",
			"properties": {
			  "SpaceAvailable": {
				"type": "string",
				"enum": ["Sufficient", "Insufficient"]
			  },
			  "Remarks": { "type": "string", "maxLength": 100 }
			}
		  },
		  "OtherRemarks": { "type": "string", "maxLength": 100 }
		}
	  },
	  "Kitchen": {
		"type": "object",
		"properties": {
		  "KitchenAssessed": {
			"type": "string",
			"enum": ["Assessed", "Not Applicable"]
		  },
		  "KitchenKerb": {
			"type": "object",
			"properties": {
			  "PresenceOfKerb": { "type": "boolean" },
			  "Type": { "type": "string", "enum": ["Complete", "End"] },
			  "Remarks": { "type": "string", "maxLength": 100 },
			  "Measurement": { "type": "string", "maxLength": 100 }
			}
		  },
		  "KitchenRugs": {
			"type": "object",
			"properties": {
			  "PresenceOfRugs": { "type": "boolean" },
			  "Remarks": { "type": "string", "maxLength": 100 }
			}
		  },
		  "KitchenStove": {
			"type": "object",
			"properties": {
			  "PresenceOfStove": { "type": "boolean" },
			  "Height": { "type": "number" },
			  "Remarks": { "type": "string", "maxLength": 100 }
			}
		  },
		  "KitchenItemHeight": {
			"type": "object",
			"properties": {
			  "PresenceOfItemHeight": { "type": "boolean" },
			  "Height": { "type": "number" },
			  "Remarks": { "type": "string", "enum": ["Able", "Unable"] }
			}
		  },
		  "KitchenTable": {
			"type": "object",
			"properties": {
			  "PresenceOfTable": { "type": "boolean" },
			  "Height": { "type": "number" },
			  "Remarks": { "type": "string", "maxLength": 100 }
			}
		  },
		  "KitchenChair": {
			"type": "object",
			"properties": {
			  "PresenceOfChair": { "type": "boolean" },
			  "Height": { "type": "number" },
			  "Remarks": { "type": "string", "enum": ["Able", "Unable"] }
			}
		  },
		  "OtherRemarks": { "type": "string", "maxLength": 100 }
		}
	  },
	  "OtherAreas": {
		"type": "object",
		"properties": {
		  "OtherAreasAssessed": {
			"type": "string",
			"enum": ["Assessed", "Not Applicable"]
		  },
		  "OtherAreasRemarks": { "type": "string", "maxLength": 500 }
		}
	  },
	  "OtherAssessments": {
		"type": "object",
		"properties": {
		  "OtherAssessmentsAssessed": {
			"type": "string",
			"enum": ["Assessed", "Not Applicable"]
		  },
		  "OtherAssessmentsRemarks": { "type": "string", "maxLength": 500 }
		}
	  },
	  "SubjectiveInformation": {
		"type": "object",
		"properties": {
		  "NotApplicable": { "type": "boolean" },
		  "ClientReported": { "type": "string", "maxLength": 500 },
		  "PresenceOfPain": {
			"type": "string",
			"enum": ["Yes", "No"]
		  },
		  "PainDetails": {
			"type": "object",
			"properties": {
			  "Location": { "type": "string", "maxLength": 50 },
			  "Nature": { "type": "string", "maxLength": 50 },
			  "Severity": { "type": "string", "maxLength": 50 },
			  "Frequency": { "type": "string", "maxLength": 50 },
			  "PainHistory": { "type": "string", "maxLength": 200 }
			}
		  },
		  "Problems": {
			"type": "array",
			"items": {
			  "type": "object",
			  "properties": {
				"MainProblems": { "type": "string", "maxLength": 100 },
				"Recommendations": { "type": "string", "maxLength": 100 }
			  }
			}
		  }
		}
	  },
	  "ClientFamilyEducation": {
		"type": "object",
		"properties": {
		  "EducationProvidedTo": {
			"type": "string",
			"enum": ["Client", "Social Support"]
		  },
		  "SocialSupport": {
			"type": "array",
			"items": {
			  "type": "string"
			}
		  },
		  "EducationDone": { "type": "string", "maxLength": 500 },
		  "EducationPerformance": {
			"type": "string",
			"enum": ["Competent", "Not Competent", "Not Applicable"]
		  },
		  "EducationPerformanceRemarks": { "type": "string", "maxLength": 50 },
		  "EducationFollowup": {
			"type": "object",
			"properties": {
			  "FollowupNeeded": { "type": "boolean" },
			  "FollowupRemarks": { "type": "string", "maxLength": 50 }
			}
		  }
		}
	  },
	  "AttachmentLink": { "type": "string" }
	}
  }