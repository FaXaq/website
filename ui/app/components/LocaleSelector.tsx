import { Button, Menu, Portal } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';

interface LocaleContextType {
  locale: string;
  setLocale: (lang: string) => void;
}

export const LocaleContext = React.createContext<LocaleContextType>(undefined);

function LocaleSelector () {
  const { i18n } = useTranslation();
  const locales = i18n.languages;

  const { locale, setLocale } = React.useContext(LocaleContext);
  const remainingLocales = locales.filter((l) => l !== locale);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // necessary to avoid mismatch between front & server upon local default selection
  if (!isMounted) {
    return;
  }

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button variant="outline" size="sm">
          {locale.toUpperCase()}
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {
              remainingLocales.map(l => (
                <Menu.Item value={l} key={l} onClick={() => setLocale(l)}>
                  {l.toUpperCase()}
                </Menu.Item>
              ))
            }
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

export { LocaleSelector };
