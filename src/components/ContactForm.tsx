"use client";

import { contact, contactMe } from "@/resources";
import { Button, Row, Heading, Input, Text, Background, Column } from "@once-ui-system/core";
import { opacity, SpacingToken } from "@once-ui-system/core";
import { useState } from "react";

function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  }) as T;
}

export const ContactForm: React.FC<React.ComponentProps<typeof Column>> = ({ ...flex }) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    if (email === "") {
      return true;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!validateEmail(value)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };

  const debouncedHandleChange = debounce(handleChange, 2000);

  const handleBlur = () => {
    setTouched(true);
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
    }
  };

  return (
    <Column
      overflow="hidden"
      fillWidth
      padding="xl"
      radius="l"
      marginBottom="m"
      horizontal="center"
      align="center"
      background="surface"
      border="neutral-alpha-weak"
    >
      <Background
        top="0"
        position="absolute"
        mask={{
          x: contact.effects.mask.x,
          y: contact.effects.mask.y,
          radius: contact.effects.mask.radius,
          cursor: contact.effects.mask.cursor,
        }}
        gradient={{
          display: contact.effects.gradient.display,
          opacity: contact.effects.gradient.opacity as opacity,
          x: contact.effects.gradient.x,
          y: contact.effects.gradient.y,
          width: contact.effects.gradient.width,
          height: contact.effects.gradient.height,
          tilt: contact.effects.gradient.tilt,
          colorStart: contact.effects.gradient.colorStart,
          colorEnd: contact.effects.gradient.colorEnd,
        }}
        dots={{
          display: contact.effects.dots.display,
          opacity: contact.effects.dots.opacity as opacity,
          size: contact.effects.dots.size as SpacingToken,
          color: contact.effects.dots.color,
        }}
        grid={{
          display: contact.effects.grid.display,
          opacity: contact.effects.grid.opacity as opacity,
          color: contact.effects.grid.color,
          width: contact.effects.grid.width,
          height: contact.effects.grid.height,
        }}
        lines={{
          display: contact.effects.lines.display,
          opacity: contact.effects.lines.opacity as opacity,
          size: contact.effects.lines.size as SpacingToken,
          thickness: contact.effects.lines.thickness,
          angle: contact.effects.lines.angle,
          color: contact.effects.lines.color,
        }}
      />
      <Heading style={{ position: "relative" }} marginBottom="s" variant="display-strong-xs">
        {contactMe.title}
      </Heading>
      {contactMe.display && <Text
        style={{
          position: "relative",
          maxWidth: "var(--responsive-width-xs)",
        }}
        wrap="balance"
        marginBottom="l"
        onBackground="neutral-medium"
      >
        {contactMe.description}
      </Text>}
      <form
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
        action={contact.action}
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
      >
        <Row id="mc_embed_signup_scroll" fillWidth maxWidth={24} s={{ direction: "column" }} gap="8">
          <Input
            formNoValidate
            id="mce-EMAIL"
            name="EMAIL"
            type="email"
            placeholder="Email"
            required
            onChange={(e) => {
              if (error) {
                handleChange(e);
              } else {
                debouncedHandleChange(e);
              }
            }}
            onBlur={handleBlur}
            errorMessage={error}
          />
          <div style={{ display: "none" }}>
            <input
              type="checkbox"
              readOnly
              name="group[3492][1]"
              id="mce-group[3492]-3492-0"
              value=""
              checked
            />
          </div>
          <div id="mce-responses" className="clearfalse">
            <div className="response" id="mce-error-response" style={{ display: "none" }}></div>
            <div className="response" id="mce-success-response" style={{ display: "none" }}></div>
          </div>
          <div aria-hidden="true" style={{ position: "absolute", left: "-5000px" }}>
            <input
              type="text"
              readOnly
              name="b_c1a5a210340eb6c7bff33b2ba_0462d244aa"
              tabIndex={-1}
              value=""
            />
          </div>
          <div className="clear">
            <Row height="48" vertical="center">
              <Button id="mc-embedded-subscribe" value="Subscribe" size="m" fillWidth>
                Send
              </Button>
            </Row>
          </div>
        </Row>
      </form>
    </Column>
  );
};
