"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

import { FormSchema } from './form-schema'

interface MultiStepFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function MultiStepFormComponent({ formData, setFormData }: MultiStepFormProps) {
  const [step, setStep] = useState(1)

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

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1)
  }

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
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
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentFunctionalStatus">Current Functional Status</Label>
                <Textarea
                  id="currentFunctionalStatus"
                  name="currentFunctionalStatus"
                  value={formData.currentFunctionalStatus}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assessedAddress">Assessed Address</Label>
                <Input
                  id="assessedAddress"
                  name="assessedAddress"
                  value={formData.assessedAddress}
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
                <Label htmlFor="typeOfAccommodation">Type of Accommodation</Label>
                <Input
                  id="typeOfAccommodation"
                  name="socialBackground.typeOfAccommodation"
                  value={formData.socialBackground.typeOfAccommodation}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Home Situation</Label>
                <RadioGroup
                  name="socialBackground.homeSituation"
                  value={formData.socialBackground.homeSituation}
                  onValueChange={(value) => handleSelectChange("socialBackground.homeSituation", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Lives alone" id="lives-alone" />
                    <Label htmlFor="lives-alone">Lives alone</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Lives with someone" id="lives-with-someone" />
                    <Label htmlFor="lives-with-someone">Lives with someone</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="communityResources">Community Resources</Label>
                <Input
                  id="communityResources"
                  name="socialBackground.communityResources"
                  value={formData.socialBackground.communityResources}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mainCaregiver">Main Caregiver</Label>
                <Select
                  name="socialBackground.mainCaregiver"
                  value={formData.socialBackground.mainCaregiver}
                  onValueChange={(value) => handleSelectChange("socialBackground.mainCaregiver", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select main caregiver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Self">Self</SelectItem>
                    <SelectItem value="Helper">Helper</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label>Equipment Required for Home Visit</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="equipmentRequired-nil"
                      name="equipmentsRequiredForHomeVisit.nil"
                      checked={formData.equipmentsRequiredForHomeVisit.nil}
                      onCheckedChange={(checked) =>
                        handleSelectChange("equipmentsRequiredForHomeVisit.nil", checked)
                      }
                    />
                    <Label htmlFor="equipmentRequired-nil">Nil</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="equipmentRequired-wheelchair"
                      name="equipmentsRequiredForHomeVisit.wheelchair"
                      checked={formData.equipmentsRequiredForHomeVisit.wheelchair}
                      onCheckedChange={(checked) =>
                        handleSelectChange("equipmentsRequiredForHomeVisit.wheelchair", checked)
                      }
                    />
                    <Label htmlFor="equipmentRequired-wheelchair">Wheelchair</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipmentRequired-walkingAids">Walking Aids</Label>
                  <Input
                    id="equipmentRequired-walkingAids"
                    name="equipmentsRequiredForHomeVisit.walkingAids"
                    value={formData.equipmentsRequiredForHomeVisit.walkingAids}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipmentRequired-other">Other</Label>
                  <Input
                    id="equipmentRequired-other"
                    name="equipmentsRequiredForHomeVisit.other"
                    value={formData.equipmentsRequiredForHomeVisit.other}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Equipment Available at Home</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="equipmentAvailable-nil"
                      name="equipmentsAvailableAtHome.nil"
                      checked={formData.equipmentsAvailableAtHome.nil}
                      onCheckedChange={(checked) =>
                        handleSelectChange("equipmentsAvailableAtHome.nil", checked)
                      }
                    />
                    <Label htmlFor="equipmentAvailable-nil">Nil</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="equipmentAvailable-wheelchair"
                      name="equipmentsAvailableAtHome.wheelchair"
                      checked={formData.equipmentsAvailableAtHome.wheelchair}
                      onCheckedChange={(checked) =>
                        handleSelectChange("equipmentsAvailableAtHome.wheelchair", checked)
                      }
                    />
                    <Label htmlFor="equipmentAvailable-wheelchair">Wheelchair</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipmentAvailable-walkingAids">Walking Aids</Label>
                  <Input
                    id="equipmentAvailable-walkingAids"
                    name="equipmentsAvailableAtHome.walkingAids"
                    value={formData.equipmentsAvailableAtHome.walkingAids}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipmentAvailable-other">Other</Label>
                  <Input
                    id="equipmentAvailable-other"
                    name="equipmentsAvailableAtHome.other"
                    value={formData.equipmentsAvailableAtHome.other}
                    onChange={handleInputChange}
                  />
                </div>
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
                <Label htmlFor="liftLanding">Lift Landing</Label>
                <Select
                  name="externalAccessibilityToHouse.liftLanding"
                  value={formData.externalAccessibilityToHouse.liftLanding}
                  onValueChange={(value) =>
                    handleSelectChange("externalAccessibilityToHouse.liftLanding", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lift landing status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Assessed">Assessed</SelectItem>
                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dimensionsOfCorridor">Dimensions of Corridor</Label>
                <Input
                  id="dimensionsOfCorridor"
                  name="externalAccessibilityToHouse.corridorFlat.dimensionsOfCorridor"
                  value={formData.externalAccessibilityToHouse.corridorFlat.dimensionsOfCorridor}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="presenceOfClutter">Presence of Clutter</Label>
                <Input
                  id="presenceOfClutter"
                  name="externalAccessibilityToHouse.corridorFlat.presenceOfClutter"
                  value={formData.externalAccessibilityToHouse.corridorFlat.presenceOfClutter}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sufficientSpaceForWheelchair"
                  name="externalAccessibilityToHouse.sufficientSpaceForWheelchair"
                  checked={formData.externalAccessibilityToHouse.sufficientSpaceForWheelchair}
                  onCheckedChange={(checked) =>
                    handleSelectChange("externalAccessibilityToHouse.sufficientSpaceForWheelchair", checked)
                  }
                />
                <Label htmlFor="sufficientSpaceForWheelchair">Sufficient Space for Wheelchair</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="numberOfSteps">Number of Steps at Entrance</Label>
                <Input
                  id="numberOfSteps"
                  name="externalAccessibilityToHouse.stepsAtEntrance.numberOfSteps"
                  type="number"
                  value={formData.externalAccessibilityToHouse.stepsAtEntrance.numberOfSteps}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stepDimensions">Step Dimensions</Label>
                <Input
                  id="stepDimensions"
                  name="externalAccessibilityToHouse.stepsAtEntrance.dimensions"
                  value={formData.externalAccessibilityToHouse.stepsAtEntrance.dimensions}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kerbAtEntrance">Kerb at Entrance</Label>
                <Input
                  id="kerbAtEntrance"
                  name="externalAccessibilityToHouse.kerbAtEntrance"
                  value={formData.externalAccessibilityToHouse.kerbAtEntrance}
                  onChange={handleInputChange}
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="livingAreaAssessed"
                  name="livingArea.assessed"
                  checked={formData.livingArea.assessed}
                  onCheckedChange={(checked) => handleSelectChange("livingArea.assessed", checked)}
                />
                <Label htmlFor="livingAreaAssessed">Living Area Assessed</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="numberOfStepsLivingArea">Number of Steps in Living Area</Label>
                <Input
                  id="numberOfStepsLivingArea"
                  name="livingArea.presenceOfStairs.numberOfSteps"
                  type="number"
                  value={formData.livingArea.presenceOfStairs.numberOfSteps}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stepDimensionsLivingArea">Step Dimensions in Living Area</Label>
                <Input
                  id="stepDimensionsLivingArea"
                  name="livingArea.presenceOfStairs.dimensions"
                  value={formData.livingArea.presenceOfStairs.dimensions}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="presenceOfRug">Presence of Rugs</Label>
                <Input
                  id="presenceOfRug"
                  name="livingArea.presenceOfRugs"
                  value={formData.livingArea.presenceOfRugs}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sofaHeight">Sofa Height (cm)</Label>
                <Input
                  id="sofaHeight"
                  name="livingArea.sofaHeight"
                  type="number"
                  value={formData.livingArea.sofaHeight}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ableToGetUpIndependently"
                  name="livingArea.ableToGetUpIndependently"
                  checked={formData.livingArea.ableToGetUpIndependently}
                  onCheckedChange={(checked) =>
                    handleSelectChange("livingArea.ableToGetUpIndependently", checked)
                  }
                />
                <Label htmlFor="ableToGetUpIndependently">Able to Get Up Independently</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sufficientSpaceForFurnitureAccess"
                  name="livingArea.sufficientSpaceForFurnitureAccess"
                  checked={formData.livingArea.sufficientSpaceForFurnitureAccess}
                  onCheckedChange={(checked) =>
                    handleSelectChange("livingArea.sufficientSpaceForFurnitureAccess", checked)
                  }
                />
                <Label htmlFor="sufficientSpaceForFurnitureAccess">
                  Sufficient Space for Furniture Access
                </Label>
              </div>
            </CardContent>
          </>
        )
      case 6:
        return (
          <>
            <CardHeader>
              <CardTitle>Bathroom</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bathroomLocation">Bathroom Location</Label>
                <Input
                  id="bathroomLocation"
                  name="bathroom.location"
                  value={formData.bathroom.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathroomKerbAtEntrance">Kerb at Entrance</Label>
                <Input
                  id="bathroomKerbAtEntrance"
                  name="bathroom.kerbAtEntrance"
                  value={formData.bathroom.kerbAtEntrance}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathroomPresenceOfRugs">Presence of Rugs</Label>
                <Input
                  id="bathroomPresenceOfRugs"
                  name="bathroom.presenceOfRugs"
                  value={formData.bathroom.presenceOfRugs}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathroomNonSlipMat">Non-Slip Mat</Label>
                <Input
                  id="bathroomNonSlipMat"
                  name="bathroom.nonSlipMat"
                  value={formData.bathroom.nonSlipMat}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathroomShowerArea">Shower Area</Label>
                <Input
                  id="bathroomShowerArea"
                  name="bathroom.showerArea"
                  value={formData.bathroom.showerArea}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathroomToiletType">Toilet Type</Label>
                <Input
                  id="bathroomToiletType"
                  name="bathroom.toiletType"
                  value={formData.bathroom.toiletType}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathroomToiletHeight">Toilet Height (cm)</Label>
                <Input
                  id="bathroomToiletHeight"
                  name="bathroom.toiletHeight"
                  type="number"
                  value={formData.bathroom.toiletHeight}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bathroomPresenceOfGrabBars"
                  name="bathroom.presenceOfGrabBars"
                  checked={formData.bathroom.presenceOfGrabBars}
                  onCheckedChange={(checked) => handleSelectChange("bathroom.presenceOfGrabBars", checked)}
                />
                <Label htmlFor="bathroomPresenceOfGrabBars">Presence of Grab Bars</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bathroomSufficientSpaceForShowerAccess"
                  name="bathroom.sufficientSpaceForShowerAccess"
                  checked={formData.bathroom.sufficientSpaceForShowerAccess}
                  onCheckedChange={(checked) =>
                    handleSelectChange("bathroom.sufficientSpaceForShowerAccess", checked)
                  }
                />
                <Label htmlFor="bathroomSufficientSpaceForShowerAccess">
                  Sufficient Space for Shower Access
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bathroomAdequateLighting"
                  name="bathroom.adequateLighting"
                  checked={formData.bathroom.adequateLighting}
                  onCheckedChange={(checked) => handleSelectChange("bathroom.adequateLighting", checked)}
                />
                <Label htmlFor="bathroomAdequateLighting">Adequate Lighting</Label>
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bedroomAssessed"
                  name="bedroom.assessed"
                  checked={formData.bedroom.assessed}
                  onCheckedChange={(checked) => handleSelectChange("bedroom.assessed", checked)}
                />
                <Label htmlFor="bedroomAssessed">Bedroom Assessed</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedroomBedHeight">Bed Height (cm)</Label>
                <Input
                  id="bedroomBedHeight"
                  name="bedroom.bedHeight"
                  type="number"
                  value={formData.bedroom.bedHeight}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bedroomAbleToGetUpIndependently"
                  name="bedroom.ableToGetUpIndependently"
                  checked={formData.bedroom.ableToGetUpIndependently}
                  onCheckedChange={(checked) =>
                    handleSelectChange("bedroom.ableToGetUpIndependently", checked)
                  }
                />
                <Label htmlFor="bedroomAbleToGetUpIndependently">Able to Get Up Independently</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedroomPresenceOfRugs">Presence of Rugs</Label>
                <Input
                  id="bedroomPresenceOfRugs"
                  name="bedroom.presenceOfRugs"
                  value={formData.bedroom.presenceOfRugs}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bedroomAdequateLighting"
                  name="bedroom.adequateLighting"
                  checked={formData.bedroom.adequateLighting}
                  onCheckedChange={(checked) => handleSelectChange("bedroom.adequateLighting", checked)}
                />
                <Label htmlFor="bedroomAdequateLighting">Adequate Lighting</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bedroomPresenceOfNightlight"
                  name="bedroom.presenceOfNightlight"
                  checked={formData.bedroom.presenceOfNightlight}
                  onCheckedChange={(checked) => handleSelectChange("bedroom.presenceOfNightlight", checked)}
                />
                <Label htmlFor="bedroomPresenceOfNightlight">Presence of Nightlight</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bedroomSufficientSpaceForFurnitureAccess"
                  name="bedroom.sufficientSpaceForFurnitureAccess"
                  checked={formData.bedroom.sufficientSpaceForFurnitureAccess}
                  onCheckedChange={(checked) =>
                    handleSelectChange("bedroom.sufficientSpaceForFurnitureAccess", checked)
                  }
                />
                <Label htmlFor="bedroomSufficientSpaceForFurnitureAccess">
                  Sufficient Space for Furniture Access
                </Label>
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
                <Label htmlFor="kitchenKerbAtEntrance">Kerb at Entrance</Label>
                <Input
                  id="kitchenKerbAtEntrance"
                  name="kitchen.kerbAtEntrance"
                  value={formData.kitchen.kerbAtEntrance}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kitchenPresenceOfRugs">Presence of Rugs</Label>
                <Input
                  id="kitchenPresenceOfRugs"
                  name="kitchen.presenceOfRugs"
                  value={formData.kitchen.presenceOfRugs}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kitchenStoveHeight">Stove Height (cm)</Label>
                <Input
                  id="kitchenStoveHeight"
                  name="kitchen.stoveHeight"
                  type="number"
                  value={formData.kitchen.stoveHeight}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kitchenItemStorageHeight">Item Storage Height (cm)</Label>
                <Input
                  id="kitchenItemStorageHeight"
                  name="kitchen.itemStorageHeight"
                  type="number"
                  value={formData.kitchen.itemStorageHeight}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kitchenDiningTableHeight">Dining Table Height (cm)</Label>
                <Input
                  id="kitchenDiningTableHeight"
                  name="kitchen.diningTableHeight"
                  type="number"
                  value={formData.kitchen.diningTableHeight}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kitchenDiningChairHeight">Dining Chair Height (cm)</Label>
                <Input
                  id="kitchenDiningChairHeight"
                  name="kitchen.diningChairHeight"
                  type="number"
                  value={formData.kitchen.diningChairHeight}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </>
        )
      case 9:
        return (
          <>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otherAreas">Other Areas</Label>
                <Textarea
                  id="otherAreas"
                  name="otherAreas"
                  value={formData.otherAreas.join("\n")}
                  onChange={(e) => handleSelectChange("otherAreas", e.target.value.split("\n"))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientReportedInformation">Client Reported Information</Label>
                <Textarea
                  id="clientReportedInformation"
                  name="clientReportedInformation"
                  value={formData.clientReportedInformation}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="presenceOfPain"
                  name="presenceOfPain"
                  checked={formData.presenceOfPain}
                  onCheckedChange={(checked) => handleSelectChange("presenceOfPain", checked)}
                />
                <Label htmlFor="presenceOfPain">Presence of Pain</Label>
              </div>
              {formData.presenceOfPain && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="painLocation">Pain Location</Label>
                    <Input
                      id="painLocation"
                      name="painDetails.location"
                      value={formData.painDetails.location}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="painSeverity">Pain Severity</Label>
                    <Input
                      id="painSeverity"
                      name="painDetails.severity"
                      value={formData.painDetails.severity}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="painNature">Pain Nature</Label>
                    <Input
                      id="painNature"
                      name="painDetails.nature"
                      value={formData.painDetails.nature}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="painFrequency">Pain Frequency</Label>
                    <Input
                      id="painFrequency"
                      name="painDetails.frequency"
                      value={formData.painDetails.frequency}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="painHistory">Pain History</Label>
                    <Textarea
                      id="painHistory"
                      name="painDetails.painHistory"
                      value={formData.painDetails.painHistory}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </>
        )
      case 10:
        return (
          <>
            <CardHeader>
              <CardTitle>Assessment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mainProblems">Main Problems</Label>
                <Textarea
                  id="mainProblems"
                  name="mainProblems"
                  value={formData.mainProblems.join("\n")}
                  onChange={(e) => handleSelectChange("mainProblems", e.target.value.split("\n"))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recommendations">Recommendations</Label>
                <Textarea
                  id="recommendations"
                  name="recommendations"
                  value={formData.recommendations.join("\n")}
                  onChange={(e) => handleSelectChange("recommendations", e.target.value.split("\n"))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="educationProvidedTo">Education Provided To</Label>
                <Input
                  id="educationProvidedTo"
                  name="clientEducation.educationProvidedTo"
                  value={formData.clientEducation.educationProvidedTo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="educationDetails">Education Details</Label>
                <Textarea
                  id="educationDetails"
                  name="clientEducation.educationDetails"
                  value={formData.clientEducation.educationDetails}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientPerformance">Client Performance</Label>
                <Select
                  name="clientEducation.clientPerformance"
                  value={formData.clientEducation.clientPerformance}
                  onValueChange={(value) => handleSelectChange("clientEducation.clientPerformance", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client performance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Competent">Competent</SelectItem>
                    <SelectItem value="Not Competent">Not Competent</SelectItem>
                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="followUpNeeded"
                  name="clientEducation.followUpNeeded"
                  checked={formData.clientEducation.followUpNeeded}
                  onCheckedChange={(checked) => handleSelectChange("clientEducation.followUpNeeded", checked)}
                />
                <Label htmlFor="followUpNeeded">Follow-up Needed</Label>
              </div>
              {formData.clientEducation.followUpNeeded && (
                <div className="space-y-2">
                  <Label htmlFor="followUpDetails">Follow-up Details</Label>
                  <Textarea
                    id="followUpDetails"
                    name="clientEducation.followUpDetails"
                    value={formData.clientEducation.followUpDetails}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </CardContent>
          </>
        )
      case 11:
        return (
          <>
            <CardHeader>
              <CardTitle>Staff Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="staffName">Staff Name</Label>
                <Input
                  id="staffName"
                  name="staffDetails.staffName"
                  value={formData.staffDetails.staffName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="staffSignature">Staff Signature</Label>
                <Input
                  id="staffSignature"
                  name="staffDetails.staffSignature"
                  value={formData.staffDetails.staffSignature}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfVisit">Date of Visit</Label>
                <Input
                  id="dateOfVisit"
                  name="staffDetails.dateOfVisit"
                  type="date"
                  value={formData.staffDetails.dateOfVisit}
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
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto p-4 space-y-4">
      <Card>
        {renderStep()}
        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
          )}
          {step < 11 ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </CardFooter>
      </Card>
    </form>
  )
}