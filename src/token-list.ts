// const { add } = Set.prototype;

export class DOMTokenList extends Set<string> {
	add(...tokens: Array<string>): this {
		for (const token of tokens) {
			// console.info("add:", token, this);
			// add.call(this, token);
			super.add(token);
		}
		return this;
	}

	contains(token: string) {
		return this.has(token);
	}

	remove(...tokens: Array<string>) {
		for (const token of tokens) this.delete(token);
	}

	toggle(token: string, force?: boolean) {
		if (this.has(token)) {
			if (force) return true;
			this.delete(token);
		} else if (force || force === undefined) {
			this.add(token);
			return true;
		}
		return false;
	}

	replace(token: string, newToken: string) {
		if (this.has(token)) {
			this.delete(token);
			this.add(newToken);
			return true;
		}
		return false;
	}

	supports(token: string) {
		return true;
	}

	format() {
		return [...this].join(" ");
	}

	parse(tokens: string) {
		this.clear();
		this.add(...tokens.split(/\s+/));
		// for (const token of tokens.split(/\s+/)) add.call(this, token);
	}

	get value() {
		return this.format();
	}

	get length() {
		return this.size;
	}
}
