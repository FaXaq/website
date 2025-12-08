import { Button, Menu, Portal } from '@chakra-ui/react';
import React from 'react';

import type { Locale } from '@/paraglide/runtime';
import { getLocale, locales, setLocale } from '@/paraglide/runtime';

function LocaleSelector () {
  const locale = getLocale();
  const remainingLocales = locales.filter((l) => l !== locale);

  const changeLocale = (locale: Locale) => {
    setLocale(locale);
  };

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
                <Menu.Item value={l} key={l} onClick={() => changeLocale(l)}>
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
