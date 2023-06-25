import { Collection } from 'discord.js';
import { ProfileMenu } from '../interactions/menus/profile';
import { Menu } from '../interfaces/Commands';

export type MenuCollection = Collection<string, Menu>;

export default async function loadMenus(): Promise<MenuCollection> {
  const allMenus = [new ProfileMenu()];

  const menus = new Collection<string, Menu>();

  allMenus.forEach((menu) => {
    menus.set(menu.title, menu);
  });

  return menus;
}
