import { site } from "@/lib/site";

/**
 * The GoHighLevel lead form embed (site.json -> widgets.quoteForm), rendered
 * with the client's exact embed attributes, inside a container with a fixed
 * minimum height so the section never collapses while the widget script loads.
 *
 * The SMS consent wording and policy links live inside the GHL form itself.
 * When two copies share one page, give the second a different idPrefix.
 */
const FormEmbed = ({ idPrefix = "inline" }: { idPrefix?: string }) => {
  const form = site.widgets.quoteForm;
  const frameId = `${idPrefix}-${form.formId}`;

  return (
    <div className="ghl-form-shell w-full" style={{ minHeight: `${form.minHeight}px` }}>
      <iframe
        src={form.src}
        style={{
          width: "100%",
          height: `${form.height}px`,
          minHeight: `${form.height}px`,
          border: "none",
          borderRadius: "8px",
        }}
        id={frameId}
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name={form.name}
        data-height={String(form.height)}
        data-layout-iframe-id={frameId}
        data-form-id={form.formId}
        data-cookie-consent="true"
        data-cookie-consent-provider="auto"
        title={form.name}
      />
    </div>
  );
};

export default FormEmbed;
