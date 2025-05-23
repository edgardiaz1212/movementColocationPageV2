import React, { useState, useContext } from "react";
import RackDetails from "../component/Formulary/RackDetails.jsx";
import EquipmentDetails from "../component/Formulary/EquipmentDetails.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/formulary.css";
import { ClipboardList, Save , MessageSquareText} from 'lucide-react';

function CompleteData() {
  const { store, actions } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const { entry } = location.state || {};
  const { componentType, requestType, brand, model, serial, partNumber } =
    entry || {};

  const [data, setData] = useState({
    observations: "",
    five_years_prevition: "",
    // Add all rack fields to the initial state
    has_cabinet: true,
    leased: false,
    total_cabinets: "",
    open_closed: false,
    security: false,
    type_security: "",
    has_extractors: false,
    extractors_ubication: "",
    modular: false,
    lateral_doors: false,
    lateral_ubication: "",
    rack_unit: "",
    rack_position: "",
    rack_ubication: "",
    has_accessory: false,
    accessory_description: "",
    rack_width: "",
    rack_length: "",
    rack_height: "",
    internal_pdu: "",
    input_connector: "",
    fases: "",
    output_connector: "",
    neutro: false,
    // Add all equipment fields to the initial state
    equipment_width: "",
    equipment_length: "",
    equipment_height: "",
    weight: "",
    anchor_type: "",
    service_area: false,
    service_frontal: false,
    service_back: false,
    service_lateral: false,
    rack_number: "",
    equip_rack_ubication: "",
    rack_unit_position: "",
    total_rack_units: "",
    packaging_width: "",
    packaging_length: "",
    packaging_height: "",
    access_length: "",
    access_width: "",
    access_inclination: "",
    ac_dc: "",
    input_current: "",
    power: "",
    power_supply: "",
    operation_temp: "",
    thermal_disipation: "",
    power_config: "",
  });

  const [validationErrors, setValidationErrors] = useState({});

  const isInstallationOrRelocation =
    requestType === "Instalación" || requestType === "Mudanza";

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Remove validation error when field is modified
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }

    if (name === "service_area") {
      setData((prevFormData) => {
        // Si cambia a false, resetea los campos de ubicación de servicio
        if (value === "false") {
          return {
            ...prevFormData,
            [name]: false,
            service_frontal: false,
            service_back: false,
            service_lateral: false,
          };
        }
        // Si cambia a true, solo actualiza service_area
        return {
          ...prevFormData,
          [name]: true,
        };
      });
      return;
    }

    if (type !== "checkbox" && type !== "radio") {
      setData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    } else {
      const newValue =
        type === "checkbox" ? checked : value === "true" ? true : false;

      setData((prevFormData) => ({
        ...prevFormData,
        [name]: newValue,
      }));
    }
  };

  const validateRequiredFields = () => {
    const errors = {};

    // Add your required fields here
    const requiredFields = [];
    if (requestType === "Instalación" && componentType === "Rack") {
      requiredFields.push("rack_position");
    }
    if (requestType === "Instalación" && componentType !== "Rack") {
      requiredFields.push("rack_number");
    }

    // Check for description_id and user_id
    // if (!data.description_id) {
    //     errors.description_id = true;
    // }
    // if (!store.currentUser || !store.currentUser.user_id) {
    //     errors.user_id = true;
    // }

    requiredFields.forEach((field) => {
      if (!data[field] || data[field].toString().trim() === "") {
        errors[field] = true;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    const userId = store.currentUser?.user_id; // Usa optional chaining por seguridad

  if (!userId) {
      toast.error("Error: No se pudo identificar al usuario. Por favor, inicie sesión de nuevo.");
      console.error("User ID is missing from store.currentUser in handleSave");
      return; // Detiene la ejecución si no hay ID de usuario
  }
    const isValid = validateRequiredFields();

    if (!isValid) {
      // Mensaje específico según el tipo de error
      if (requestType === "Instalación") {
        if (componentType === "Rack" && validationErrors.rack_position) {
          toast.error(
            "Para instalaciones de Rack, la posición del rack es obligatoria"
          );
        } else if (componentType !== "Rack" && validationErrors.rack_number) {
          toast.error(
            "Para instalaciones de Equipo, el número de rack donde se instalara es obligatorio"
          );
        } else {
          toast.error("Por favor complete todos los campos requeridos");
        }
      } else {
        toast.error("Por favor complete todos los campos requeridos");
      }
      return;
    }
    try {
      const { observations, five_years_prevition } = data;
      const descriptionData = {
        brand,
        model,
        serial,
        partNumber,
        five_years_prevition,
        observations,
        componentType,
        requestType,
      };

      // Crear la descripción
      const descriptionResponse = await actions.addDescription(descriptionData);
      const descriptionId = descriptionResponse.id;
      //const userId = store.currentUser.user_id;

      if (componentType === "Rack") {
        const rackData = {
          description_id: descriptionId,
          user_id: userId,
          has_cabinet: data.has_cabinet,
          leased: data.leased,
          total_cabinets: data.total_cabinets,
          open_closed: data.open_closed,
          security: data.security,
          type_security: data.type_security,
          has_extractors: data.has_extractors,
          extractors_ubication: data.extractors_ubication,
          modular: data.modular,
          lateral_doors: data.lateral_doors,
          lateral_ubication: data.lateral_ubication,
          rack_unit: data.rack_unit,
          rack_position: data.rack_position,
          rack_ubication: data.rack_ubication,
          has_accessory: data.has_accessory,
          accessory_description: data.accessory_description,
          rack_width: data.rack_width,
          rack_length: data.rack_length,
          rack_height: data.rack_height,
          internal_pdu: data.internal_pdu,
          input_connector: data.input_connector,
          fases: data.fases,
          output_connector: data.output_connector,
          neutro: data.neutro,
        };
        await actions.addRack(rackData);
      } else {
        const equipmentData = {
          equipment_width: data.equipment_width,
          equipment_length: data.equipment_length,
          equipment_height: data.equipment_height,
          weight: data.weight,
          anchor_type: data.anchor_type,
          service_area: data.service_area,
          service_frontal: data.service_frontal,
          service_back: data.service_back,
          service_lateral: data.service_lateral,
          rack_number: data.rack_number,
          equip_rack_ubication: data.equip_rack_ubication,
          rack_unit_position: data.rack_unit_position,
          total_rack_units: data.total_rack_units,
          packaging_width: data.packaging_width,
          packaging_length: data.packaging_length,
          packaging_height: data.packaging_height,
          access_length: data.access_length,
          access_width: data.access_width,
          access_inclination: data.access_inclination,
          ac_dc: data.ac_dc,
          input_current: data.input_current,
          power: data.power,
          power_supply: data.power_supply,
          operation_temp: data.operation_temp,
          thermal_disipation: data.thermal_disipation,
          power_config: data.power_config,
          description_id: descriptionId,
          user_id: userId,
        };
        await actions.addEquipment(equipmentData);
      }

      // Obtener descripciones actualizadas
      await actions.getDescriptionsByUser();

      toast.success("Equipo registrado");
      console.log("Equipo añadido");
      setTimeout(() => {
        navigate(`/register-data/${userId}`);
      }, 1000);
    } catch (error) {
      console.error("Error saving data:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      }
      toast.error("Llene los campos necesarios");
    }
  };

  return (
    <div className="container mt-3">
      <ToastContainer
        theme="dark"
        position="top-center"
        pauseOnFocusLoss={false}
        autoClose={3000}
        hideProgressBar
      />
      <h1 className="formulario-header m-3 text-center">
       <ClipboardList  size={60}/>Datos para {requestType} del {componentType} modelo {model} con serial:{" "}
        {serial}
      </h1>
      <div className="formulario">
        {componentType === "Rack" && (
          <RackDetails
            requestType={requestType}
            brand={brand}
            model={model}
            serial={serial}
            partNumber={partNumber}
            handleFieldChange={handleFieldChange}
            isInstallationOrRelocation={isInstallationOrRelocation}
            data={data}
            validationErrors={validationErrors}
          />
        )}
        {componentType !== "Rack" && (
          <EquipmentDetails
            requestType={requestType}
            brand={brand}
            model={model}
            serial={serial}
            partNumber={partNumber}
            handleFieldChange={handleFieldChange}
            isInstallationOrRelocation={isInstallationOrRelocation}
            data={data}
            validationErrors={validationErrors}
          />
        )}

        {/* Observaciones */}
        <div className="container ps-5 pe-5 ">
          <div className="input-group mt-3  ">
            <span className="input-group-text mb-2"><MessageSquareText size={18} className="me-2" /> Observaciones</span>
            <textarea
              className="form-control mb-2"
              aria-label="With textarea"
              id="observations"
              name="observations"
              value={data.observations}
              onChange={handleFieldChange}
            ></textarea>
          </div>
          {isInstallationOrRelocation && (
            <div className="input-group mb-1 pb-3">
              <span className="input-group-text">Previsión de 5 años</span>
              <textarea
                className="form-control"
                aria-label="With textarea"
                id="five_years_prevition"
                name="five_years_prevition"
                value={data.five_years_prevition}
                onChange={handleFieldChange}
              ></textarea>
            </div>
          )}
        </div>
      </div>
      <button className=" btn btn-primary m-3" onClick={handleSave}>
       <Save size={18} className="me-2 "/>  Guardar
      </button>
    </div>
  );
}

export default CompleteData;
