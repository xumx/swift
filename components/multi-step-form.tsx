"use client"


import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface MultiStepFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  step: any;
  setStep: React.Dispatch<React.SetStateAction<any>>;
}

export function MultiStepFormComponent({ formData, setFormData, step, setStep }: MultiStepFormProps) {
  // Define the steps and labels
  const steps = [
    { step: 1, label: "Medical History" },
    { step: 2, label: "Background" },
    { step: 3, label: "Equipments" },
    { step: 4, label: "Accessibility" },
    { step: 5, label: "Living Area" },
    { step: 6, label: "Bathroom/Toilet" },
    { step: 7, label: "Bedroom" },
    { step: 8, label: "Kitchen" }
  ];

  // Navigation bar component
  const renderNavigation = () => (
    <div className="flex mb-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap">
      {steps.map(({ step: stepNumber, label }) => (
        <Button
          key={stepNumber}
          className={cn(
            "flex-shrink-0 text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2 mr-1 mb-1",
            step === stepNumber ? "bg-white text-black" : "bg-transparent text-black"
          )}
          onClick={(e) => {setStep(stepNumber); e.preventDefault();}}
        >
          {label}
        </Button>
      ))}
    </div>
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prevData: any) => {
      const newData = { ...prevData }
      const keys = name.split('.')
      let current: any = newData
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = type === 'number' ? Number(value) : value
      return newData
    })
  }

  const handleSelectChange = (name: string, value: string | boolean | number) => {
    setFormData((prevData: any) => {
      const newData = { ...prevData }
      const keys = name.split('.')
      let current: any = newData
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  const handleArrayChange = (name: string, value: any) => {
    setFormData((prevData: any) => {
      const newData = { ...prevData }
      const keys = name.split('.')
      let current: any = newData
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      const lastKey = keys[keys.length - 1]
      current[lastKey] = Array.isArray(current[lastKey]) ? [...current[lastKey], value] : [value]
      return newData
    })
  }

  const handleNext = () => {
    setStep((prevStep: number) => prevStep + 1)
  }

  const handlePrevious = () => {
    setStep((prevStep: number) => prevStep - 1)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    console.log("Form submitted:", formData)

    // Format formData as a multi-line string
    const formattedData = Object.entries(formData)
      .map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          return `${key}:\n${JSON.stringify(value, null, 2)}`
        }
        return `${key}: ${value}`
      })
      .join('\n\n')

    console.log("Formatted form data:")
    console.log(formattedData)
    alert("Form Submitted:\n" + formattedData);
    // Here you would typically send the data to your backend
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="MedicalHistory">Medical History</Label>
                <Textarea
                  id="MedicalHistory"
                  name="MedicalHistory"
                  value={formData.MedicalHistory || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="CurrentFunctionalStatus">Current Functional Status</Label>
                <Input
                  id="CurrentFunctionalStatus"
                  name="CurrentFunctionalStatus"
                  value={formData.CurrentFunctionalStatus || ""}
                  onChange={handleInputChange}
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="AssessedAddress">Assessed Address</Label>
                <Input
                  id="AssessedAddress"
                  name="AssessedAddress"
                  value={formData.AssessedAddress || ""}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </>
        )
      case 2:
        return (
          <>
            <CardHeader>
              <CardTitle>Social Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="AccommodationType">Accommodation Type</Label>
                <Input
                  id="AccommodationType"
                  name="SocialBackground.AccommodationType"
                  value={formData.SocialBackground?.AccommodationType || ""}
                  onChange={handleInputChange}
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label>Home Situation</Label>
                {["Lives alone", "Lives alone in daytime", "Lives with someone", "Community Resources"].map(
                  (situation) => (
                    <div key={situation} className="flex items-center space-x-2">
                      <Checkbox
                        id={`HomeSituation-${situation}`}
                        checked={formData.SocialBackground?.HomeSituation?.includes(situation)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleArrayChange("SocialBackground.HomeSituation", situation)
                          } else {
                            handleSelectChange(
                              "SocialBackground.HomeSituation",
                              formData.SocialBackground?.HomeSituation?.filter((item: any) => item !== situation)
                            )
                          }
                        }}
                      />
                      <Label htmlFor={`HomeSituation-${situation}`}>{situation}</Label>
                    </div>
                  )
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="HomeSituationRemarks">Home Situation Remarks</Label>
                <Input
                  id="HomeSituationRemarks"
                  name="SocialBackground.HomeSituationRemarks"
                  value={formData.SocialBackground?.HomeSituationRemarks || ""}
                  onChange={handleInputChange}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label>Social Support</Label>
                {(formData.SocialBackground?.SocialSupport || []).map((support: any, index: any) => (
                  <div key={index} className="space-y-2 border p-2 rounded">
                    <Input
                      placeholder="Name"
                      value={support.Name || ""}
                      onChange={(e) =>
                        handleSelectChange(`SocialBackground.SocialSupport[${index}].Name`, e.target.value)
                      }
                    />
                    <Input
                      placeholder="Relationship"
                      value={support.Relationship || ""}
                      onChange={(e) =>
                        handleSelectChange(
                          `SocialBackground.SocialSupport[${index}].Relationship`,
                          e.target.value
                        )
                      }
                    />
                    <Input
                      placeholder="Contact No"
                      value={support.ContactNo || ""}
                      onChange={(e) =>
                        handleSelectChange(`SocialBackground.SocialSupport[${index}].ContactNo`, e.target.value)
                      }
                    />
                    <Select
                      value={support.IsSpokesperson || ""}
                      onValueChange={(value) =>
                        handleSelectChange(`SocialBackground.SocialSupport[${index}].IsSpokesperson`, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Is Spokesperson?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    handleArrayChange("SocialBackground.SocialSupport", {
                      Name: "",
                      Relationship: "",
                      ContactNo: "",
                      IsSpokesperson: "",
                    })
                  }
                >
                  Add Social Support
                </Button>
              </div>
            </CardContent>
          </>
        )
      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle>Equipment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="EquipmentRequiredForHomeVisit">Equipment Required for Home Visit</Label>
                <Select
                  value={formData.Equipments?.EquipmentRequiredForHomeVisit || ""}
                  onValueChange={(value) =>
                    handleSelectChange("Equipments.EquipmentRequiredForHomeVisit", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {["NIL", "Wheelchair", "Walking Aids", "Others"].map((equipment) => (
                      <SelectItem key={equipment} value={equipment}>
                        {equipment}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="EquipmentsRequiredRemarks">Equipments Required Remarks</Label>
                <Input
                  id="EquipmentsRequiredRemarks"
                  name="Equipments.EquipmentsRequiredRemarks"
                  value={formData.Equipments?.EquipmentsRequiredRemarks || ""}
                  onChange={handleInputChange}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="EquipmentAvailableAtHome">Equipment Available at Home</Label>
                <Select
                  value={formData.Equipments?.EquipmentAvailableAtHome || ""}
                  onValueChange={(value) => handleSelectChange("Equipments.EquipmentAvailableAtHome", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {["NIL", "Wheelchair", "Walking Aids", "Others"].map((equipment) => (
                      <SelectItem key={equipment} value={equipment}>
                        {equipment}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="EquipmentsAvailableRemarks">Equipments Available Remarks</Label>
                <Input
                  id="EquipmentsAvailableRemarks"
                  name="Equipments.EquipmentsAvailableRemarks"
                  value={formData.Equipments?.EquipmentsAvailableRemarks || ""}
                  onChange={handleInputChange}
                  maxLength={100}
                />
              </div>
            </CardContent>
          </>
        )
      case 4:
        return (
          <>
            <CardHeader>
              <CardTitle>External Accessibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="AccessibilityAssessed">Accessibility Assessed</Label>
                <Select
                  value={formData.ExternalAccessibility?.AccessibilityAssessed || ""}
                  onValueChange={(value) =>
                    handleSelectChange("ExternalAccessibility.AccessibilityAssessed", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assessed">Assessed</SelectItem>
                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="LiftLandingFlat">Lift Landing Flat</Label>
                <Select
                  value={formData.ExternalAccessibility?.AccessibilityLanding?.LiftLandingFlat || ""}
                  onValueChange={(value) =>
                    handleSelectChange("ExternalAccessibility.AccessibilityLanding.LiftLandingFlat", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lift landing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lift-Landing">Lift-Landing</SelectItem>
                    <SelectItem value="Non Lift-Landing">Non Lift-Landing</SelectItem>
                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="AccessibilityLandingRemarks">Accessibility Landing Remarks</Label>
                <Input
                  id="AccessibilityLandingRemarks"
                  name="ExternalAccessibility.AccessibilityLanding.Remarks"
                  value={formData.ExternalAccessibility?.AccessibilityLanding?.Remarks || ""}
                  onChange={handleInputChange}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="TypeOfFlat">Type of Flat</Label>
                <Select
                  value={formData.ExternalAccessibility?.AccessibilityFlat?.TypeOfFlat || ""}
                  onValueChange={(value) =>
                    handleSelectChange("ExternalAccessibility.AccessibilityFlat.TypeOfFlat", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select flat type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corner Flat">Corner Flat</SelectItem>
                    <SelectItem value="Corridor Flat">Corridor Flat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="DimensionsOfCorridor">Dimensions of Corridor</Label>
                <Input
                  id="DimensionsOfCorridor"
                  name="ExternalAccessibility.AccessibilityFlat.DimensionsOfCorridor"
                  value={formData.ExternalAccessibility?.AccessibilityFlat?.DimensionsOfCorridor || ""}
                  onChange={handleInputChange}
                  maxLength={100}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PresenceOfClutter"
                  checked={formData.ExternalAccessibility?.AccessibilityClutter?.PresenceOfClutter || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("ExternalAccessibility.AccessibilityClutter.PresenceOfClutter", checked)
                  }
                />
                <Label htmlFor="PresenceOfClutter">Presence of Clutter</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="AccessibilityClutterRemarks">Accessibility Clutter Remarks</Label>
                <Input
                  id="AccessibilityClutterRemarks"
                  name="ExternalAccessibility.AccessibilityClutter.Remarks"
                  value={formData.ExternalAccessibility?.AccessibilityClutter?.Remarks || ""}
                  onChange={handleInputChange}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="SpaceAvailable">Space Available</Label>
                <Select
                  value={formData.ExternalAccessibility?.AccessibilitySpace?.SpaceAvailable || ""}
                  onValueChange={(value) =>
                    handleSelectChange("ExternalAccessibility.AccessibilitySpace.SpaceAvailable", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select space availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sufficient">Sufficient</SelectItem>
                    <SelectItem value="Insufficient">Insufficient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="WidthOfDoor">Width of Door</Label>
                <Input
                  id="WidthOfDoor"
                  name="ExternalAccessibility.AccessibilitySpace.WidthOfDoor"
                  type="number"
                  value={formData.ExternalAccessibility?.AccessibilitySpace?.WidthOfDoor || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PresenceOfKerb"
                  checked={formData.ExternalAccessibility?.AccessibilityKerbEntrance?.PresenceOfKerb || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange(
                      "ExternalAccessibility.AccessibilityKerbEntrance.PresenceOfKerb",
                      checked
                    )
                  }
                />
                <Label htmlFor="PresenceOfKerb">Presence of Kerb</Label>
              </div>
              {formData.ExternalAccessibility?.AccessibilityKerbEntrance?.PresenceOfKerb && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="KerbType">Kerb Type</Label>
                    <Select
                      value={formData.ExternalAccessibility?.AccessibilityKerbEntrance?.Type || ""}
                      onValueChange={(value) =>
                        handleSelectChange("ExternalAccessibility.AccessibilityKerbEntrance.Type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select kerb type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Complete">Complete</SelectItem>
                        <SelectItem value="End">End</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="KerbRemarks">Kerb Remarks</Label>
                    <Input
                      id="KerbRemarks"
                      name="ExternalAccessibility.AccessibilityKerbEntrance.Remarks"
                      value={formData.ExternalAccessibility?.AccessibilityKerbEntrance?.Remarks || ""}
                      onChange={handleInputChange}
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="KerbMeasurement">Kerb Measurement</Label>
                    <Input
                      id="KerbMeasurement"
                      name="ExternalAccessibility.AccessibilityKerbEntrance.Measurement"
                      value={formData.ExternalAccessibility?.AccessibilityKerbEntrance?.Measurement || ""}
                      onChange={handleInputChange}
                      maxLength={100}
                    />
                  </div>
                </>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PresenceOfSteps"
                  checked={formData.ExternalAccessibility?.AccessibilitySteps?.PresenceOfSteps || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("ExternalAccessibility.AccessibilitySteps.PresenceOfSteps", checked)
                  }
                />
                <Label htmlFor="PresenceOfSteps">Presence of Steps</Label>
              </div>
              {formData.ExternalAccessibility?.AccessibilitySteps?.PresenceOfSteps && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="NumberOfSteps">Number of Steps</Label>
                    <Input
                      id="NumberOfSteps"
                      name="ExternalAccessibility.AccessibilitySteps.NumberOfSteps"
                      type="number"
                      value={formData.ExternalAccessibility?.AccessibilitySteps?.NumberOfSteps || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="DimensionsOfSteps">Dimensions of Steps</Label>
                    <Input
                      id="DimensionsOfSteps"
                      name="ExternalAccessibility.AccessibilitySteps.Dimensions"
                      type="number"
                      value={formData.ExternalAccessibility?.AccessibilitySteps?.Dimensions || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="OtherRemarks">Other Remarks</Label>
                <Input
                  id="OtherRemarks"
                  name="ExternalAccessibility.OtherRemarks"
                  value={formData.ExternalAccessibility?.OtherRemarks || ""}
                  onChange={handleInputChange}
                  maxLength={100}
                />
              </div>
            </CardContent>
          </>
        )
      case 5:
        return (
          <>
            <CardHeader>
              <CardTitle>Living Area</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="LivingAreaAssessed">Living Area Assessed</Label>
                <Select
                  value={formData.LivingArea?.LivingAreaAssessed || ""}
                  onValueChange={(value) => handleSelectChange("LivingArea.LivingAreaAssessed", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assessed">Assessed</SelectItem>
                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PresenceOfStairs"
                  checked={formData.LivingArea?.LivingAreaStairs?.PresenceOfStairs || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("LivingArea.LivingAreaStairs.PresenceOfStairs", checked)
                  }
                />
                <Label htmlFor="PresenceOfStairs">Presence of Stairs</Label>
              </div>
              {formData.LivingArea?.LivingAreaStairs?.PresenceOfStairs && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="NumberOfSteps">Number of Steps</Label>
                    <Input
                      id="NumberOfSteps"
                      name="LivingArea.LivingAreaStairs.NumberOfSteps"
                      type="number"
                      value={formData.LivingArea?.LivingAreaStairs?.NumberOfSteps || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="DimensionsOfSteps">Dimensions of Steps</Label>
                    <Input
                      id="DimensionsOfSteps"
                      name="LivingArea.LivingAreaStairs.DimensionsOfSteps"
                      type="number"
                      value={formData.LivingArea?.LivingAreaStairs?.DimensionsOfSteps || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PresenceOfRugs"
                  checked={formData.LivingArea?.LivingAreaRugs?.PresenceOfRugs || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("LivingArea.LivingAreaRugs.PresenceOfRugs", checked)
                  }
                />
                <Label htmlFor="PresenceOfRugs">Presence of Rugs</Label>
              </div>
              {formData.LivingArea?.LivingAreaRugs?.PresenceOfRugs && (
                <div className="space-y-2">
                  <Label htmlFor="RugsRemarks">Rugs Remarks</Label>
                  <Input
                    id="RugsRemarks"
                    name="LivingArea.LivingAreaRugs.Remarks"
                    value={formData.LivingArea?.LivingAreaRugs?.Remarks || ""}
                    onChange={handleInputChange}
                    maxLength={100}
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PresenceOfSofa"
                  checked={formData.LivingArea?.LivingAreaSofa?.PresenceOfSofa || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("LivingArea.LivingAreaSofa.PresenceOfSofa", checked)
                  }
                />
                <Label htmlFor="PresenceOfSofa">Presence of Sofa</Label>
              </div>
              {formData.LivingArea?.LivingAreaSofa?.PresenceOfSofa && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="SofaHeight">Sofa Height</Label>
                    <Input
                      id="SofaHeight"
                      name="LivingArea.LivingAreaSofa.Height"
                      type="number"
                      value={formData.LivingArea?.LivingAreaSofa?.Height || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="SofaRemarks">Sofa Remarks</Label>
                    <Select
                      value={formData.LivingArea?.LivingAreaSofa?.Remarks || ""}
                      onValueChange={(value) => handleSelectChange("LivingArea.LivingAreaSofa.Remarks", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sofa remarks" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Able">Able</SelectItem>
                        <SelectItem value="Unable">Unable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="SpaceAvailable">Space Available</Label>
                <Select
                  value={formData.LivingArea?.LivingAreaSpace?.SpaceAvailable || ""}
                  onValueChange={(value) => handleSelectChange("LivingArea.LivingAreaSpace.SpaceAvailable", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select space availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sufficient">Sufficient</SelectItem>
                    <SelectItem value="Insufficient">Insufficient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="SpaceRemarks">Space Remarks</Label>
                <Input
                  id="SpaceRemarks"
                  name="LivingArea.LivingAreaSpace.Remarks"
                  value={formData.LivingArea?.LivingAreaSpace?.Remarks || ""}
                  onChange={handleInputChange}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="OtherRemarks">Other Remarks</Label>
                <Input
                  id="OtherRemarks"
                  name="LivingArea.OtherRemarks"
                  value={formData.LivingArea?.OtherRemarks || ""}
                  onChange={handleInputChange}
                  maxLength={100}
                />
              </div>
            </CardContent>
          </>
        )
      case 6:
        return (
          <>
            <CardHeader>
              <CardTitle>Bathroom/Toilet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="BathroomAssessed">Bathroom Assessed</Label>
                <Select
                  value={formData.BathroomToilet?.BathroomAssessed || ""}
                  onValueChange={(value) => handleSelectChange("BathroomToilet.BathroomAssessed", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assessed">Assessed</SelectItem>
                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>              </div>
              <div className="space-y-2">
                <Label htmlFor="BathroomLocation">Bathroom Location</Label>
                <Input
                  id="BathroomLocation"
                  name="BathroomToilet.BathroomLocation"
                  value={formData.BathroomToilet?.BathroomLocation || ""}
                  onChange={handleInputChange}
                  maxLength={100}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PresenceOfKerb"
                  checked={formData.BathroomToilet?.BathroomKerbEntrance?.PresenceOfKerb || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("BathroomToilet.BathroomKerbEntrance.PresenceOfKerb", checked)
                  }
                />
                <Label htmlFor="PresenceOfKerb">Presence of Kerb</Label>
              </div>
              {formData.BathroomToilet?.BathroomKerbEntrance?.PresenceOfKerb && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="KerbType">Kerb Type</Label>
                    <Select
                      value={formData.BathroomToilet?.BathroomKerbEntrance?.Type || ""}
                      onValueChange={(value) =>
                        handleSelectChange("BathroomToilet.BathroomKerbEntrance.Type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select kerb type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Complete">Complete</SelectItem>
                        <SelectItem value="End">End</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="KerbRemarks">Kerb Remarks</Label>
                    <Input
                      id="KerbRemarks"
                      name="BathroomToilet.BathroomKerbEntrance.Remarks"
                      value={formData.BathroomToilet?.BathroomKerbEntrance?.Remarks || ""}
                      onChange={handleInputChange}
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="KerbMeasurement">Kerb Measurement</Label>
                    <Input
                      id="KerbMeasurement"
                      name="BathroomToilet.BathroomKerbEntrance.Measurement"
                      value={formData.BathroomToilet?.BathroomKerbEntrance?.Measurement || ""}
                      onChange={handleInputChange}
                      maxLength={100}
                    />
                  </div>
                </>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PresenceOfRugs"
                  checked={formData.BathroomToilet?.BathroomRugs?.PresenceOfRugs || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("BathroomToilet.BathroomRugs.PresenceOfRugs", checked)
                  }
                />
                <Label htmlFor="PresenceOfRugs">Presence of Rugs</Label>
              </div>
              {formData.BathroomToilet?.BathroomRugs?.PresenceOfRugs && (
                <div className="space-y-2">
                  <Label htmlFor="RugsRemarks">Rugs Remarks</Label>
                  <Input
                    id="RugsRemarks"
                    name="BathroomToilet.BathroomRugs.Remarks"
                    value={formData.BathroomToilet?.BathroomRugs?.Remarks || ""}
                    onChange={handleInputChange}
                    maxLength={100}
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PresenceOfMats"
                  checked={formData.BathroomToilet?.BathroomMats?.PresenceOfMats || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("BathroomToilet.BathroomMats.PresenceOfMats", checked)
                  }
                />
                <Label htmlFor="PresenceOfMats">Presence of Mats</Label>
              </div>
              {formData.BathroomToilet?.BathroomMats?.PresenceOfMats && (
                <div className="space-y-2">
                  <Label htmlFor="MatsRemarks">Mats Remarks</Label>
                  <Input
                    id="MatsRemarks"
                    name="BathroomToilet.BathroomMats.Remarks"
                    value={formData.BathroomToilet?.BathroomMats?.Remarks || ""}
                    onChange={handleInputChange}
                    maxLength={100}
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PresenceOfShower"
                  checked={formData.BathroomToilet?.BathroomShower?.PresenceOfShower || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("BathroomToilet.BathroomShower.PresenceOfShower", checked)
                  }
                />
                <Label htmlFor="PresenceOfShower">Presence of Shower</Label>
              </div>
              {formData.BathroomToilet?.BathroomShower?.PresenceOfShower && (
                <div className="space-y-2">
                  <Label htmlFor="ShowerRemarks">Shower Remarks</Label>
                  <Input
                    id="ShowerRemarks"
                    name="BathroomToilet.BathroomShower.Remarks"
                    value={formData.BathroomToilet?.BathroomShower?.Remarks || ""}
                    onChange={handleInputChange}
                    maxLength={100}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="ToiletType">Toilet Type</Label>
                <Select
                  value={formData.BathroomToilet?.BathroomToiletType || ""}
                  onValueChange={(value) => handleSelectChange("BathroomToilet.BathroomToiletType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select toilet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Squatting">Squatting</SelectItem>
                    <SelectItem value="Sitting">Sitting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ToiletHeight">Toilet Height</Label>
                <Input
                  id="ToiletHeight"
                  name="BathroomToilet.BathroomToiletHeight"
                  type="number"
                  value={formData.BathroomToilet?.BathroomToiletHeight || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ToiletRemarks">Toilet Remarks</Label>
                <Select
                  value={formData.BathroomToilet?.BathroomToiletRemarks || ""}
                  onValueChange={(value) => handleSelectChange("BathroomToilet.BathroomToiletRemarks", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select toilet remarks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Able">Able</SelectItem>
                    <SelectItem value="Unable">Unable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PresenceOfBars"
                  checked={formData.BathroomToilet?.BathroomBars?.PresenceOfBars || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("BathroomToilet.BathroomBars.PresenceOfBars", checked)
                  }
                />
                <Label htmlFor="PresenceOfBars">Presence of Bars</Label>
              </div>
              {formData.BathroomToilet?.BathroomBars?.PresenceOfBars && (
                <div className="space-y-2">
                  <Label htmlFor="BarsRemarks">Bars Remarks</Label>
                  <Input
                    id="BarsRemarks"
                    name="BathroomToilet.BathroomBars.Remarks"
                    value={formData.BathroomToilet?.BathroomBars?.Remarks || ""}
                    onChange={handleInputChange}
                    maxLength={100}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="SpaceAvailable">Space Available</Label>
                <Select
                  value={formData.BathroomToilet?.BathroomSpace?.SpaceAvailable || ""}
                  onValueChange={(value) => handleSelectChange("BathroomToilet.BathroomSpace.SpaceAvailable", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select space availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sufficient">Sufficient</SelectItem>
                    <SelectItem value="Insufficient">Insufficient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="Lighting">Lighting</Label>
                <Select
                  value={formData.BathroomToilet?.BathroomLighting?.Lighting || ""}
                  onValueChange={(value) => handleSelectChange("BathroomToilet.BathroomLighting.Lighting", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lighting condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Adequate">Adequate</SelectItem>
                    <SelectItem value="Inadequate">Inadequate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="OtherRemarks">Other Remarks</Label>
                <Input
                  id="OtherRemarks"
                  name="BathroomToilet.OtherRemarks"
                  value={formData.BathroomToilet?.OtherRemarks || ""}
                  onChange={handleInputChange}
                  maxLength={100}
                />
              </div>
            </CardContent>
          </>
        )
      case 7:
        return (
          <>
            <CardHeader>
              <CardTitle>Bedroom</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="BedroomAssessed">Bedroom Assessed</Label>
                <Select
                  value={formData.Bedroom?.BedroomAssessed || ""}
                  onValueChange={(value) => handleSelectChange("Bedroom.BedroomAssessed", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assessed">Assessed</SelectItem>
                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PresenceOfBed"
                  checked={formData.Bedroom?.BedroomBed?.PresenceOfBed || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("Bedroom.BedroomBed.PresenceOfBed", checked)
                  }
                />
                <Label htmlFor="PresenceOfBed">Presence of Bed</Label>
              </div>
              {formData.Bedroom?.BedroomBed?.PresenceOfBed && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="BedHeight">Bed Height</Label>
                    <Input
                      id="BedHeight"
                      name="Bedroom.BedroomBed.Height"
                      type="number"
                      value={formData.Bedroom?.BedroomBed?.Height || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="BedRemarks">Bed Remarks</Label>
                    <Select
                      value={formData.Bedroom?.BedroomBed?.Remarks || ""}
                      onValueChange={(value) => handleSelectChange("Bedroom.BedroomBed.Remarks", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select bed remarks" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Able">Able</SelectItem>
                        <SelectItem value="Unable">Unable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PresenceOfRugs"
                  checked={formData.Bedroom?.BedroomRugs?.PresenceOfRugs || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("Bedroom.BedroomRugs.PresenceOfRugs", checked)
                  }
                />
                <Label htmlFor="PresenceOfRugs">Presence of Rugs</Label>
              </div>
              {formData.Bedroom?.BedroomRugs?.PresenceOfRugs && (
                <div className="space-y-2">
                  <Label htmlFor="RugsRemarks">Rugs Remarks</Label>
                  <Input
                    id="RugsRemarks"
                    name="Bedroom.BedroomRugs.Remarks"
                    value={formData.Bedroom?.BedroomRugs?.Remarks || ""}
                    onChange={handleInputChange}
                    maxLength={100}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="BedroomLighting">Bedroom Lighting</Label>
                <Select
                  value={formData.Bedroom?.BedroomLighting || ""}
                  onValueChange={(value) => handleSelectChange("Bedroom.BedroomLighting", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lighting condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Adequate">Adequate</SelectItem>
                    <SelectItem value="Inadequate">Inadequate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="BedroomLight"
                  checked={formData.Bedroom?.BedroomLight || false}
                  onCheckedChange={(checked) => handleSelectChange("Bedroom.BedroomLight", checked)}
                />
                <Label htmlFor="BedroomLight">Bedroom Light</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="SpaceAvailable">Space Available</Label>
                <Select
                  value={formData.Bedroom?.BedroomSpace?.SpaceAvailable || ""}
                  onValueChange={(value) => handleSelectChange("Bedroom.BedroomSpace.SpaceAvailable", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select space availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sufficient">Sufficient</SelectItem>
                    <SelectItem value="Insufficient">Insufficient</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="SpaceRemarks">Space Remarks</Label>
                <Input
                  id="SpaceRemarks"
                  name="Bedroom.BedroomSpace.Remarks"
                  value={formData.Bedroom?.BedroomSpace?.Remarks || ""}
                  onChange={handleInputChange}
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="OtherRemarks">Other Remarks</Label>
                <Input
                  id="OtherRemarks"
                  name="Bedroom.OtherRemarks"
                  value={formData.Bedroom?.OtherRemarks || ""}
                  onChange={handleInputChange}
                  maxLength={100}
                />
              </div>
            </CardContent>
          </>
        )
      case 8:
        return (
          <>
            <CardHeader>
              <CardTitle>Kitchen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="KitchenAssessed">Kitchen Assessed</Label>
                <Select
                  value={formData.Kitchen?.KitchenAssessed || ""}
                  onValueChange={(value) => handleSelectChange("Kitchen.KitchenAssessed", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assessed">Assessed</SelectItem>
                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PresenceOfKerb"
                  checked={formData.Kitchen?.KitchenKerb?.PresenceOfKerb || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("Kitchen.KitchenKerb.PresenceOfKerb", checked)
                  }
                />
                <Label htmlFor="PresenceOfKerb">Presence of Kerb</Label>
              </div>
              {formData.Kitchen?.KitchenKerb?.PresenceOfKerb && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="KerbType">Kerb Type</Label>
                    <Select
                      value={formData.Kitchen?.KitchenKerb?.Type || ""}
                      onValueChange={(value) => handleSelectChange("Kitchen.KitchenKerb.Type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select kerb type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Complete">Complete</SelectItem>
                        <SelectItem value="End">End</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="KerbRemarks">Kerb Remarks</Label>
                    <Input
                      id="KerbRemarks"
                      name="Kitchen.KitchenKerb.Remarks"
                      value={formData.Kitchen?.KitchenKerb?.Remarks || ""}
                      onChange={handleInputChange}
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="KerbMeasurement">Kerb Measurement</Label>
                    <Input
                      id="KerbMeasurement"
                      name="Kitchen.KitchenKerb.Measurement"
                      value={formData.Kitchen?.KitchenKerb?.Measurement || ""}
                      onChange={handleInputChange}
                      maxLength={100}
                    />
                  </div>
                </>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PresenceOfRugs"
                  checked={formData.Kitchen?.KitchenRugs?.PresenceOfRugs || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("Kitchen.KitchenRugs.PresenceOfRugs", checked)
                  }
                />
                <Label htmlFor="PresenceOfRugs">Presence of Rugs</Label>
              </div>
              {formData.Kitchen?.KitchenRugs?.PresenceOfRugs && (
                <div className="space-y-2">
                  <Label htmlFor="RugsRemarks">Rugs Remarks</Label>
                  <Input
                    id="RugsRemarks"
                    name="Kitchen.KitchenRugs.Remarks"
                    value={formData.Kitchen?.KitchenRugs?.Remarks || ""}
                    onChange={handleInputChange}
                    maxLength={100}
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PresenceOfStove"
                  checked={formData.Kitchen?.KitchenStove?.PresenceOfStove || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("Kitchen.KitchenStove.PresenceOfStove", checked)
                  }
                />
                <Label htmlFor="PresenceOfStove">Presence of Stove</Label>
              </div>
              {formData.Kitchen?.KitchenStove?.PresenceOfStove && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="StoveHeight">Stove Height</Label>
                    <Input
                      id="StoveHeight"
                      name="Kitchen.KitchenStove.Height"
                      type="number"
                      value={formData.Kitchen?.KitchenStove?.Height || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="StoveRemarks">Stove Remarks</Label>
                    <Input
                      id="StoveRemarks"
                      name="Kitchen.KitchenStove.Remarks"
                      value={formData.Kitchen?.KitchenStove?.Remarks || ""}
                      onChange={handleInputChange}
                      maxLength={100}
                    />
                  </div>
                </>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PresenceOfItemHeight"
                  checked={formData.Kitchen?.KitchenItemHeight?.PresenceOfItemHeight || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("Kitchen.KitchenItemHeight.PresenceOfItemHeight", checked)
                  }
                />
                <Label htmlFor="PresenceOfItemHeight">Presence of Item Height</Label>
              </div>
              {formData.Kitchen?.KitchenItemHeight?.PresenceOfItemHeight && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="ItemHeight">Item Height</Label>
                    <Input
                      id="ItemHeight"
                      name="Kitchen.KitchenItemHeight.Height"
                      type="number"
                      value={formData.Kitchen?.KitchenItemHeight?.Height || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ItemHeightRemarks">Item Height Remarks</Label>
                    <Select
                      value={formData.Kitchen?.KitchenItemHeight?.Remarks || ""}
                      onValueChange={(value) => handleSelectChange("Kitchen.KitchenItemHeight.Remarks", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select item height remarks" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Able">Able</SelectItem>
                        <SelectItem value="Unable">Unable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PresenceOfTable"
                  checked={formData.Kitchen?.KitchenTable?.PresenceOfTable || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("Kitchen.KitchenTable.PresenceOfTable", checked)
                  }
                />
                <Label htmlFor="PresenceOfTable">Presence of Table</Label>
              </div>
              {formData.Kitchen?.KitchenTable?.PresenceOfTable && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="TableHeight">Table Height</Label>
                    <Input
                      id="TableHeight"
                      name="Kitchen.KitchenTable.Height"
                      type="number"
                      value={formData.Kitchen?.KitchenTable?.Height || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="TableRemarks">Table Remarks</Label>
                    <Input
                      id="TableRemarks"
                      name="Kitchen.KitchenTable.Remarks"
                      value={formData.Kitchen?.KitchenTable?.Remarks || ""}
                      onChange={handleInputChange}
                      maxLength={100}
                    />
                  </div>
                </>
              )}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="PresenceOfChair"
                  checked={formData.Kitchen?.KitchenChair?.PresenceOfChair || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("Kitchen.KitchenChair.PresenceOfChair", checked)
                  }
                />
                <Label htmlFor="PresenceOfChair">Presence of Chair</Label>
              </div>
              {formData.Kitchen?.KitchenChair?.PresenceOfChair && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="ChairHeight">Chair Height</Label>
                    <Input
                      id="ChairHeight"
                      name="Kitchen.KitchenChair.Height"
                      type="number"
                      value={formData.Kitchen?.KitchenChair?.Height || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ChairRemarks">Chair Remarks</Label>
                    <Select
                      value={formData.Kitchen?.KitchenChair?.Remarks || ""}
                      onValueChange={(value) => handleSelectChange("Kitchen.KitchenChair.Remarks", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select chair remarks" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Able">Able</SelectItem>
                        <SelectItem value="Unable">Unable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="OtherRemarks">Other Remarks</Label>
                <Input
                  id="OtherRemarks"
                  name="Kitchen.OtherRemarks"
                  value={formData.Kitchen?.OtherRemarks || ""}
                  onChange={handleInputChange}
                  maxLength={100}
                />
              </div>
            </CardContent>
          </>
        )
      case 9:
        return (
          <>
            <CardHeader>
              <CardTitle>Other Areas and Assessments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="OtherAreasAssessed">Other Areas Assessed</Label>
                <Select
                  value={formData.OtherAreas?.OtherAreasAssessed || ""}
                  onValueChange={(value) => handleSelectChange("OtherAreas.OtherAreasAssessed", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assessed">Assessed</SelectItem>
                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="OtherAreasRemarks">Other Areas Remarks</Label>
                <Textarea
                  id="OtherAreasRemarks"
                  name="OtherAreas.OtherAreasRemarks"
                  value={formData.OtherAreas?.OtherAreasRemarks || ""}
                  onChange={handleInputChange}
                  maxLength={500}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="OtherAssessmentsAssessed">Other Assessments</Label>
                <Select
                  value={formData.OtherAssessments?.OtherAssessmentsAssessed || ""}
                  onValueChange={(value) =>
                    handleSelectChange("OtherAssessments.OtherAssessmentsAssessed", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assessed">Assessed</SelectItem>
                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="OtherAssessmentsRemarks">Other Assessments Remarks</Label>
                <Textarea
                  id="OtherAssessmentsRemarks"
                  name="OtherAssessments.OtherAssessmentsRemarks"
                  value={formData.OtherAssessments?.OtherAssessmentsRemarks || ""}
                  onChange={handleInputChange}
                  maxLength={500}
                />
              </div>
            </CardContent>
          </>
        )
      case 10:
        return (
          <>
            <CardHeader>
              <CardTitle>Subjective Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="NotApplicable"
                  checked={formData.SubjectiveInformation?.NotApplicable || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("SubjectiveInformation.NotApplicable", checked)
                  }
                />
                <Label htmlFor="NotApplicable">Not Applicable</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ClientReported">Client Reported</Label>
                <Textarea
                  id="ClientReported"
                  name="SubjectiveInformation.ClientReported"
                  value={formData.SubjectiveInformation?.ClientReported || ""}
                  onChange={handleInputChange}
                  maxLength={500}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="PresenceOfPain">Presence of Pain</Label>
                <Select
                  value={formData.SubjectiveInformation?.PresenceOfPain || ""}
                  onValueChange={(value) =>
                    handleSelectChange("SubjectiveInformation.PresenceOfPain", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pain presence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.SubjectiveInformation?.PresenceOfPain === "Yes" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="PainLocation">Pain Location</Label>
                    <Input
                      id="PainLocation"
                      name="SubjectiveInformation.PainDetails.Location"
                      value={formData.SubjectiveInformation?.PainDetails?.Location || ""}
                      onChange={handleInputChange}
                      maxLength={50}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="PainNature">Pain Nature</Label>
                    <Input
                      id="PainNature"
                      name="SubjectiveInformation.PainDetails.Nature"
                      value={formData.SubjectiveInformation?.PainDetails?.Nature || ""}
                      onChange={handleInputChange}
                      maxLength={50}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="PainSeverity">Pain Severity</Label>
                    <Input
                      id="PainSeverity"
                      name="SubjectiveInformation.PainDetails.Severity"
                      value={formData.SubjectiveInformation?.PainDetails?.Severity || ""}
                      onChange={handleInputChange}
                      maxLength={50}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="PainFrequency">Pain Frequency</Label>
                    <Input
                      id="PainFrequency"
                      name="SubjectiveInformation.PainDetails.Frequency"
                      value={formData.SubjectiveInformation?.PainDetails?.Frequency || ""}
                      onChange={handleInputChange}
                      maxLength={50}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="PainHistory">Pain History</Label>
                    <Textarea
                      id="PainHistory"
                      name="SubjectiveInformation.PainDetails.PainHistory"
                      value={formData.SubjectiveInformation?.PainDetails?.PainHistory || ""}
                      onChange={handleInputChange}
                      maxLength={200}
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label>Problems and Recommendations</Label>
                {(formData.SubjectiveInformation?.Problems || []).map((problem: any, index: number) => (
                  <div key={index} className="space-y-2 border p-2 rounded">
                    <Input
                      placeholder="Main Problem"
                      value={problem.MainProblems || ""}
                      onChange={(e) =>
                        handleSelectChange(
                          `SubjectiveInformation.Problems[${index}].MainProblems`,
                          e.target.value
                        )
                      }
                      maxLength={100}
                    />
                    <Input
                      placeholder="Recommendation"
                      value={problem.Recommendations || ""}
                      onChange={(e) =>
                        handleSelectChange(
                          `SubjectiveInformation.Problems[${index}].Recommendations`,
                          e.target.value
                        )
                      }
                      maxLength={100}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    handleArrayChange("SubjectiveInformation.Problems", {
                      MainProblems: "",
                      Recommendations: "",
                    })
                  }
                >
                  Add Problem
                </Button>
              </div>
            </CardContent>
          </>
        )
      case 11:
        return (
          <>
            <CardHeader>
              <CardTitle>Client/Family Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="EducationProvidedTo">Education Provided To</Label>
                <Select
                  value={formData.ClientFamilyEducation?.EducationProvidedTo || ""}
                  onValueChange={(value) =>
                    handleSelectChange("ClientFamilyEducation.EducationProvidedTo", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Client">Client</SelectItem>
                    <SelectItem value="Social Support">Social Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.ClientFamilyEducation?.EducationProvidedTo === "Social Support" && (
                <div className="space-y-2">
                  <Label>Social Support</Label>
                  {["AWWA TEST SISTER", "Brother Sea", "AWWA HSC Child"].map((support) => (
                    <div key={support} className="flex items-center space-x-2">
                      <Checkbox
                        id={`SocialSupport-${support}`}
                        checked={formData.ClientFamilyEducation?.SocialSupport?.includes(support)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleArrayChange("ClientFamilyEducation.SocialSupport", support)
                          } else {
                            handleSelectChange(
                              "ClientFamilyEducation.SocialSupport",
                              formData.ClientFamilyEducation?.SocialSupport?.filter(
                                (item: any) => item !== support
                              )
                            )
                          }
                        }}
                      />
                      <Label htmlFor={`SocialSupport-${support}`}>{support}</Label>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="EducationDone">Education Done</Label>
                <Textarea
                  id="EducationDone"
                  name="ClientFamilyEducation.EducationDone"
                  value={formData.ClientFamilyEducation?.EducationDone || ""}
                  onChange={handleInputChange}
                  maxLength={500}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="EducationPerformance">Education Performance</Label>
                <Select
                  value={formData.ClientFamilyEducation?.EducationPerformance || ""}
                  onValueChange={(value) =>
                    handleSelectChange("ClientFamilyEducation.EducationPerformance", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select performance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Competent">Competent</SelectItem>
                    <SelectItem value="Not Competent">Not Competent</SelectItem>
                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="EducationPerformanceRemarks">Education Performance Remarks</Label>
                <Input
                  id="EducationPerformanceRemarks"
                  name="ClientFamilyEducation.EducationPerformanceRemarks"
                  value={formData.ClientFamilyEducation?.EducationPerformanceRemarks || ""}
                  onChange={handleInputChange}
                  maxLength={50}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="FollowupNeeded"
                  checked={formData.ClientFamilyEducation?.EducationFollowup?.FollowupNeeded || false}
                  onCheckedChange={(checked) =>
                    handleSelectChange("ClientFamilyEducation.EducationFollowup.FollowupNeeded", checked)
                  }
                />
                <Label htmlFor="FollowupNeeded">Follow-up Needed</Label>
              </div>
              {formData.ClientFamilyEducation?.EducationFollowup?.FollowupNeeded && (
                <div className="space-y-2">
                  <Label htmlFor="FollowupRemarks">Follow-up Remarks</Label>
                  <Input
                    id="FollowupRemarks"
                    name="ClientFamilyEducation.EducationFollowup.FollowupRemarks"
                    value={formData.ClientFamilyEducation?.EducationFollowup?.FollowupRemarks || ""}
                    onChange={handleInputChange}
                    maxLength={50}
                  />
                </div>
              )}
            </CardContent>
          </>
        )
      case 12:
        return (
          <>
            <CardHeader>
              <CardTitle>Attachment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="AttachmentLink">Attachment Link</Label>
                <Input
                  id="AttachmentLink"
                  name="AttachmentLink"
                  value={formData.AttachmentLink || ""}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </>
        )
      default:
        return null
    }
  }

  return (
    <>
    {renderNavigation()}
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto p-4 space-y-4">
      
      <Card>
        {renderStep()}
        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
          )}
          {step < 12 ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </CardFooter>
      </Card>
    </form>
    </>
  )
}