import { Breadcrumb as ChakraBreadcrumb } from "@chakra-ui/react";
import * as React from "react";

export const BreadcrumbRoot = React.forwardRef(
  function BreadcrumbRoot(props, ref) {
    const { separator = "/", ...rest } = props;
    return (
      <ChakraBreadcrumb.Root ref={ref} separator={separator} {...rest} />
    );
  }
);

export const BreadcrumbLink = React.forwardRef(
  function BreadcrumbLink(props, ref) {
    return <ChakraBreadcrumb.Link ref={ref} {...props} />;
  }
);

export const BreadcrumbCurrentLink = React.forwardRef(
  function BreadcrumbCurrentLink(props, ref) {
    return <ChakraBreadcrumb.CurrentLink ref={ref} {...props} />;
  }
);

export const BreadcrumbEllipsis = React.forwardRef(
  function BreadcrumbEllipsis(props, ref) {
    return <ChakraBreadcrumb.Ellipsis ref={ref} {...props} />;
  }
);
