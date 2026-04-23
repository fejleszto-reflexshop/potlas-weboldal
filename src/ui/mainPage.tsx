import {useState, type ChangeEvent, type FormEvent} from "react";
import { sendData, type ReplacementFormData } from "../backend/sendData";
import { SearchableDropdown } from "./SearchableDropdown";
import '../App.css'
import {dropdownOptions} from "../backend/DropdownOptions.ts";

type MainPageProps = {
    onSuccess: () => void;
    onError: () => void;
};

function RequiredStar() {
    return <span className="ml-1 text-red-500">*</span>;
}

type FormFieldProps = {
    id: string;
    label: string;
    description?: string;
    required?: boolean;
    children: React.ReactNode;
};

function FormField({
                       id,
                       label,
                       description,
                       required = false,
                       children,
                   }: FormFieldProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={id}
                className="text-[14px] font-medium text-[#2f2f2f] leading-[1.4]"
            >
                {label}
                {required && <RequiredStar />}
            </label>

            {description && (
                <p className="text-[12px] text-[#6b6f76] leading-[1.45]">
                    {description}
                </p>
            )}

            {children}
        </div>
    );
}

export function MainPage({ onSuccess, onError }: MainPageProps) {
    const [formData, setFormData] = useState<ReplacementFormData>({
        nameOrOrderId: "",
        gameName: "",
        replacementDescription: "",
        replacementType: "",
        addressOrPickup: "",
        email: "",
        phone: "",
        attachment: null,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;

        setFormData((prev) => ({
            ...prev,
            attachment: file,
        }));
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const requiredFields = {
            nameOrOrderId: formData.nameOrOrderId.trim(),
            gameName: formData.gameName.trim(),
            replacementDescription: formData.replacementDescription.trim(),
            replacementType: formData.replacementType.trim(),
            addressOrPickup: formData.addressOrPickup.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
        };

        const hasEmptyRequiredField = Object.values(requiredFields).some(
            (value) => !value
        );

        if (hasEmptyRequiredField) {
            alert("Kérlek tölts ki minden kötelező mezőt.");
            return;
        }

        try {
            setIsSubmitting(true);

            const response = await sendData(formData);

            if (!response.ok) {
                throw new Error("Request failed");
            }

            onSuccess();
        } catch (error) {
            console.error("Submit error:", error);
            onError();
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#f6f7fb] px-4 py-10">
            <main className="mx-auto w-full max-w-170">
                <div className="mb-6 flex justify-center">
                    <img src={"https://reflexshop.hu/shop_ordered/51636/design_pic/favicon.ico"}
                         alt={"reflexshop-logo"} />
                </div>

                <section className="rounded-2xl bg-white px-6 py-7 shadow-sm ring-1 ring-black/5">
                    <header className="mb-6">
                        <h1 className="text-[30px] font-semibold tracking-[-0.02em] text-[#1f1f1f]">
                            Pótlási kérelem
                        </h1>
                        <p className="mt-2 text-[13px] leading-[1.55] text-[#5f636b]">
                            Ha hiányzott, elveszett vagy netán megsérült, ne aggódj, mi
                            segítünk. Töltsd ki ezt az űrlapot, hogy a kollégák értesüljenek
                            arról, hogy a játékod sajnos nem teljes.
                        </p>
                    </header>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <FormField
                            id="nameOrOrderId"
                            label="Név vagy rendelésszám"
                            description="Kérlek add meg a neved és/vagy a rendelésszámodat. A biztos, ha van mindkettő."
                            required
                        >
                            <input
                                id="nameOrOrderId"
                                name="nameOrOrderId"
                                type="text"
                                placeholder="Enter text"
                                required
                                value={formData.nameOrOrderId}
                                onChange={handleChange}
                                className="h-11 w-full rounded-md border border-[#d7dbe2] bg-white px-3 text-[14px] text-[#1f1f1f] outline-none transition focus:border-[#6d5dfc] focus:ring-2 focus:ring-[#6d5dfc]/20"
                            />
                        </FormField>

                        <FormField
                            id="gameName"
                            label="Játék neve"
                            description="Válaszd ki, hogy melyik játékból kérnéd a pótlást."
                            required
                        >
                            <SearchableDropdown
                                id="gameName"
                                name="gameName"
                                options={dropdownOptions}
                                value={formData.gameName}
                                onChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        gameName: value,
                                    }))
                                }
                                placeholder="Kezdd el beírni a játék nevét..."
                                required
                            />
                        </FormField>

                        <FormField
                            id="replacementDescription"
                            label="A pótlás leírása"
                            description="Írd le kérlek, hogy pontosan melyik komponens hiányzik vagy sérült."
                            required
                        >
                              <textarea
                                  id="replacementDescription"
                                  name="replacementDescription"
                                  placeholder="Enter text"
                                  required
                                  rows={4}
                                  value={formData.replacementDescription}
                                  onChange={handleChange}
                                  className="w-full rounded-md border border-[#d7dbe2] bg-white px-3 py-2.5 text-[14px] text-[#1f1f1f] outline-none transition resize-y focus:border-[#6d5dfc] focus:ring-2 focus:ring-[#6d5dfc]/20"
                              />
                        </FormField>

                        <FormField
                            id="replacementType"
                            label="Pótlási kérelem"
                            description="Jelöld be azt, amelyik igaz a pótlási kérelmedre."
                            required
                        >
                            <select
                                id="replacementType"
                                name="replacementType"
                                required
                                value={formData.replacementType}
                                onChange={handleChange}
                                className="h-11 w-full rounded-md border border-[#d7dbe2] bg-white px-3 text-[14px] text-[#1f1f1f] outline-none transition focus:border-[#6d5dfc] focus:ring-2 focus:ring-[#6d5dfc]/20"
                            >
                                <option value="">Select option...</option>
                                <option value="missing">Hiányzó alkatrész</option>
                                <option value="damaged">Sérült alkatrész</option>
                                <option value="lost">Elveszett alkatrész</option>
                                <option value="other">Egyéb</option>
                            </select>
                        </FormField>

                        <FormField
                            id="addressOrPickup"
                            label="Cím/Átvétel helye"
                            description="Írd meg kérlek, hogy milyen címre küldhetjük, vagy hogy melyik üzletben szeretnéd átvenni."
                            required
                        >
                            <input
                                id="addressOrPickup"
                                name="addressOrPickup"
                                type="text"
                                placeholder="Enter text"
                                required
                                value={formData.addressOrPickup}
                                onChange={handleChange}
                                className="h-11 w-full rounded-md border border-[#d7dbe2] bg-white px-3 text-[14px] text-[#1f1f1f] outline-none transition focus:border-[#6d5dfc] focus:ring-2 focus:ring-[#6d5dfc]/20"
                            />
                        </FormField>

                        <FormField
                            id="email"
                            label="E-mail"
                            description="Kérlek add meg az e-mail címed."
                            required
                        >
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter text"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="h-11 w-full rounded-md border border-[#d7dbe2] bg-white px-3 text-[14px] text-[#1f1f1f] outline-none transition focus:border-[#6d5dfc] focus:ring-2 focus:ring-[#6d5dfc]/20"
                            />
                        </FormField>

                        <FormField
                            id="phone"
                            label="Telefonszám"
                            description="Kérlek add meg a telefonszámod."
                            required
                        >
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="Enter text"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="h-11 w-full rounded-md border border-[#d7dbe2] bg-white px-3 text-[14px] text-[#1f1f1f] outline-none transition focus:border-[#6d5dfc] focus:ring-2 focus:ring-[#6d5dfc]/20"
                            />
                        </FormField>

                        <FormField
                            id="attachment"
                            label="Csatolmány"
                            description="A beazonosítás megkönnyítése érdekében, ha van lehetőséged, csatolj egy fotót is hozzá."
                        >
                            <label
                                htmlFor="attachment"
                                className="flex min-h-[92px] w-full cursor-pointer items-center justify-center rounded-md border border-dashed border-[#d7dbe2] bg-[#fafbfc] px-4 text-center text-[13px] text-[#6b6f76] transition hover:border-[#6d5dfc] hover:bg-[#f7f5ff]"
                            >
                                {formData.attachment
                                    ? formData.attachment.name
                                    : "Drop your files here to upload"}
                            </label>

                            <input
                                id="attachment"
                                name="attachment"
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </FormField>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-12 w-full rounded-xl bg-[#635bff] text-[14px] font-semibold text-white transition hover:bg-[#564ee8] focus:outline-none focus:ring-2 focus:ring-[#635bff]/30 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSubmitting ? "Küldés..." : "Submit"}
                            </button>
                        </div>
                    </form>
                </section>

                <footer className="mt-6 text-center text-[12px] leading-[1.6] text-[#6b6f76]">
                    <p>
                        Copyright © 2000 - {new Date().getFullYear()}. Reflexshop Kft.
                        Minden jog fenntartva!
                    </p>
                    <p>Reflexshop e-commerce team ❤️</p>
                </footer>
            </main>
        </div>
    );
}