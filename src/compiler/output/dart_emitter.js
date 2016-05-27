'use strict';"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var o = require('./output_ast');
var abstract_emitter_1 = require('./abstract_emitter');
var path_util_1 = require('./path_util');
var _debugModuleUrl = 'asset://debug/lib';
function debugOutputAstAsDart(ast) {
    var converter = new _DartEmitterVisitor(_debugModuleUrl);
    var ctx = abstract_emitter_1.EmitterVisitorContext.createRoot([]);
    var asts;
    if (lang_1.isArray(ast)) {
        asts = ast;
    }
    else {
        asts = [ast];
    }
    asts.forEach(function (ast) {
        if (ast instanceof o.Statement) {
            ast.visitStatement(converter, ctx);
        }
        else if (ast instanceof o.Expression) {
            ast.visitExpression(converter, ctx);
        }
        else if (ast instanceof o.Type) {
            ast.visitType(converter, ctx);
        }
        else {
            throw new exceptions_1.BaseException("Don't know how to print debug info for " + ast);
        }
    });
    return ctx.toSource();
}
exports.debugOutputAstAsDart = debugOutputAstAsDart;
var DartEmitter = (function () {
    function DartEmitter() {
    }
    DartEmitter.prototype.emitStatements = function (moduleUrl, stmts, exportedVars) {
        var srcParts = [];
        // Note: We are not creating a library here as Dart does not need it.
        // Dart analzyer might complain about it though.
        var converter = new _DartEmitterVisitor(moduleUrl);
        var ctx = abstract_emitter_1.EmitterVisitorContext.createRoot(exportedVars);
        converter.visitAllStatements(stmts, ctx);
        converter.importsWithPrefixes.forEach(function (prefix, importedModuleUrl) {
            srcParts.push("import '" + path_util_1.getImportModulePath(moduleUrl, importedModuleUrl, path_util_1.ImportEnv.Dart) + "' as " + prefix + ";");
        });
        srcParts.push(ctx.toSource());
        return srcParts.join('\n');
    };
    return DartEmitter;
}());
exports.DartEmitter = DartEmitter;
var _DartEmitterVisitor = (function (_super) {
    __extends(_DartEmitterVisitor, _super);
    function _DartEmitterVisitor(_moduleUrl) {
        _super.call(this, true);
        this._moduleUrl = _moduleUrl;
        this.importsWithPrefixes = new Map();
    }
    _DartEmitterVisitor.prototype.visitExternalExpr = function (ast, ctx) {
        this._visitIdentifier(ast.value, ast.typeParams, ctx);
        return null;
    };
    _DartEmitterVisitor.prototype.visitDeclareVarStmt = function (stmt, ctx) {
        if (stmt.hasModifier(o.StmtModifier.Final)) {
            if (isConstType(stmt.type)) {
                ctx.print("const ");
            }
            else {
                ctx.print("final ");
            }
        }
        else if (lang_1.isBlank(stmt.type)) {
            ctx.print("var ");
        }
        if (lang_1.isPresent(stmt.type)) {
            stmt.type.visitType(this, ctx);
            ctx.print(" ");
        }
        ctx.print(stmt.name + " = ");
        stmt.value.visitExpression(this, ctx);
        ctx.println(";");
        return null;
    };
    _DartEmitterVisitor.prototype.visitCastExpr = function (ast, ctx) {
        ctx.print("(");
        ast.value.visitExpression(this, ctx);
        ctx.print(" as ");
        ast.type.visitType(this, ctx);
        ctx.print(")");
        return null;
    };
    _DartEmitterVisitor.prototype.visitDeclareClassStmt = function (stmt, ctx) {
        var _this = this;
        ctx.pushClass(stmt);
        ctx.print("class " + stmt.name);
        if (lang_1.isPresent(stmt.parent)) {
            ctx.print(" extends ");
            stmt.parent.visitExpression(this, ctx);
        }
        ctx.println(" {");
        ctx.incIndent();
        stmt.fields.forEach(function (field) { return _this._visitClassField(field, ctx); });
        if (lang_1.isPresent(stmt.constructorMethod)) {
            this._visitClassConstructor(stmt, ctx);
        }
        stmt.getters.forEach(function (getter) { return _this._visitClassGetter(getter, ctx); });
        stmt.methods.forEach(function (method) { return _this._visitClassMethod(method, ctx); });
        ctx.decIndent();
        ctx.println("}");
        ctx.popClass();
        return null;
    };
    _DartEmitterVisitor.prototype._visitClassField = function (field, ctx) {
        if (field.hasModifier(o.StmtModifier.Final)) {
            ctx.print("final ");
        }
        else if (lang_1.isBlank(field.type)) {
            ctx.print("var ");
        }
        if (lang_1.isPresent(field.type)) {
            field.type.visitType(this, ctx);
            ctx.print(" ");
        }
        ctx.println(field.name + ";");
    };
    _DartEmitterVisitor.prototype._visitClassGetter = function (getter, ctx) {
        if (lang_1.isPresent(getter.type)) {
            getter.type.visitType(this, ctx);
            ctx.print(" ");
        }
        ctx.println("get " + getter.name + " {");
        ctx.incIndent();
        this.visitAllStatements(getter.body, ctx);
        ctx.decIndent();
        ctx.println("}");
    };
    _DartEmitterVisitor.prototype._visitClassConstructor = function (stmt, ctx) {
        ctx.print(stmt.name + "(");
        this._visitParams(stmt.constructorMethod.params, ctx);
        ctx.print(")");
        var ctorStmts = stmt.constructorMethod.body;
        var superCtorExpr = ctorStmts.length > 0 ? getSuperConstructorCallExpr(ctorStmts[0]) : null;
        if (lang_1.isPresent(superCtorExpr)) {
            ctx.print(": ");
            superCtorExpr.visitExpression(this, ctx);
            ctorStmts = ctorStmts.slice(1);
        }
        ctx.println(" {");
        ctx.incIndent();
        this.visitAllStatements(ctorStmts, ctx);
        ctx.decIndent();
        ctx.println("}");
    };
    _DartEmitterVisitor.prototype._visitClassMethod = function (method, ctx) {
        if (lang_1.isPresent(method.type)) {
            method.type.visitType(this, ctx);
        }
        else {
            ctx.print("void");
        }
        ctx.print(" " + method.name + "(");
        this._visitParams(method.params, ctx);
        ctx.println(") {");
        ctx.incIndent();
        this.visitAllStatements(method.body, ctx);
        ctx.decIndent();
        ctx.println("}");
    };
    _DartEmitterVisitor.prototype.visitFunctionExpr = function (ast, ctx) {
        ctx.print("(");
        this._visitParams(ast.params, ctx);
        ctx.println(") {");
        ctx.incIndent();
        this.visitAllStatements(ast.statements, ctx);
        ctx.decIndent();
        ctx.print("}");
        return null;
    };
    _DartEmitterVisitor.prototype.visitDeclareFunctionStmt = function (stmt, ctx) {
        if (lang_1.isPresent(stmt.type)) {
            stmt.type.visitType(this, ctx);
        }
        else {
            ctx.print("void");
        }
        ctx.print(" " + stmt.name + "(");
        this._visitParams(stmt.params, ctx);
        ctx.println(") {");
        ctx.incIndent();
        this.visitAllStatements(stmt.statements, ctx);
        ctx.decIndent();
        ctx.println("}");
        return null;
    };
    _DartEmitterVisitor.prototype.getBuiltinMethodName = function (method) {
        var name;
        switch (method) {
            case o.BuiltinMethod.ConcatArray:
                name = '.addAll';
                break;
            case o.BuiltinMethod.SubscribeObservable:
                name = 'listen';
                break;
            default:
                throw new exceptions_1.BaseException("Unknown builtin method: " + method);
        }
        return name;
    };
    _DartEmitterVisitor.prototype.visitTryCatchStmt = function (stmt, ctx) {
        ctx.println("try {");
        ctx.incIndent();
        this.visitAllStatements(stmt.bodyStmts, ctx);
        ctx.decIndent();
        ctx.println("} catch (" + abstract_emitter_1.CATCH_ERROR_VAR.name + ", " + abstract_emitter_1.CATCH_STACK_VAR.name + ") {");
        ctx.incIndent();
        this.visitAllStatements(stmt.catchStmts, ctx);
        ctx.decIndent();
        ctx.println("}");
        return null;
    };
    _DartEmitterVisitor.prototype.visitBinaryOperatorExpr = function (ast, ctx) {
        switch (ast.operator) {
            case o.BinaryOperator.Identical:
                ctx.print("identical(");
                ast.lhs.visitExpression(this, ctx);
                ctx.print(", ");
                ast.rhs.visitExpression(this, ctx);
                ctx.print(")");
                break;
            case o.BinaryOperator.NotIdentical:
                ctx.print("!identical(");
                ast.lhs.visitExpression(this, ctx);
                ctx.print(", ");
                ast.rhs.visitExpression(this, ctx);
                ctx.print(")");
                break;
            default:
                _super.prototype.visitBinaryOperatorExpr.call(this, ast, ctx);
        }
        return null;
    };
    _DartEmitterVisitor.prototype.visitLiteralArrayExpr = function (ast, ctx) {
        if (isConstType(ast.type)) {
            ctx.print("const ");
        }
        return _super.prototype.visitLiteralArrayExpr.call(this, ast, ctx);
    };
    _DartEmitterVisitor.prototype.visitLiteralMapExpr = function (ast, ctx) {
        if (isConstType(ast.type)) {
            ctx.print("const ");
        }
        if (lang_1.isPresent(ast.valueType)) {
            ctx.print("<String, ");
            ast.valueType.visitType(this, ctx);
            ctx.print(">");
        }
        return _super.prototype.visitLiteralMapExpr.call(this, ast, ctx);
    };
    _DartEmitterVisitor.prototype.visitInstantiateExpr = function (ast, ctx) {
        ctx.print(isConstType(ast.type) ? "const" : "new");
        ctx.print(' ');
        ast.classExpr.visitExpression(this, ctx);
        ctx.print("(");
        this.visitAllExpressions(ast.args, ctx, ",");
        ctx.print(")");
        return null;
    };
    _DartEmitterVisitor.prototype.visitBuiltintType = function (type, ctx) {
        var typeStr;
        switch (type.name) {
            case o.BuiltinTypeName.Bool:
                typeStr = 'bool';
                break;
            case o.BuiltinTypeName.Dynamic:
                typeStr = 'dynamic';
                break;
            case o.BuiltinTypeName.Function:
                typeStr = 'Function';
                break;
            case o.BuiltinTypeName.Number:
                typeStr = 'num';
                break;
            case o.BuiltinTypeName.Int:
                typeStr = 'int';
                break;
            case o.BuiltinTypeName.String:
                typeStr = 'String';
                break;
            default:
                throw new exceptions_1.BaseException("Unsupported builtin type " + type.name);
        }
        ctx.print(typeStr);
        return null;
    };
    _DartEmitterVisitor.prototype.visitExternalType = function (ast, ctx) {
        this._visitIdentifier(ast.value, ast.typeParams, ctx);
        return null;
    };
    _DartEmitterVisitor.prototype.visitArrayType = function (type, ctx) {
        ctx.print("List<");
        if (lang_1.isPresent(type.of)) {
            type.of.visitType(this, ctx);
        }
        else {
            ctx.print("dynamic");
        }
        ctx.print(">");
        return null;
    };
    _DartEmitterVisitor.prototype.visitMapType = function (type, ctx) {
        ctx.print("Map<String, ");
        if (lang_1.isPresent(type.valueType)) {
            type.valueType.visitType(this, ctx);
        }
        else {
            ctx.print("dynamic");
        }
        ctx.print(">");
        return null;
    };
    _DartEmitterVisitor.prototype._visitParams = function (params, ctx) {
        var _this = this;
        this.visitAllObjects(function (param) {
            if (lang_1.isPresent(param.type)) {
                param.type.visitType(_this, ctx);
                ctx.print(' ');
            }
            ctx.print(param.name);
        }, params, ctx, ',');
    };
    _DartEmitterVisitor.prototype._visitIdentifier = function (value, typeParams, ctx) {
        var _this = this;
        if (lang_1.isPresent(value.moduleUrl) && value.moduleUrl != this._moduleUrl) {
            var prefix = this.importsWithPrefixes.get(value.moduleUrl);
            if (lang_1.isBlank(prefix)) {
                prefix = "import" + this.importsWithPrefixes.size;
                this.importsWithPrefixes.set(value.moduleUrl, prefix);
            }
            ctx.print(prefix + ".");
        }
        ctx.print(value.name);
        if (lang_1.isPresent(typeParams) && typeParams.length > 0) {
            ctx.print("<");
            this.visitAllObjects(function (type) { return type.visitType(_this, ctx); }, typeParams, ctx, ',');
            ctx.print(">");
        }
    };
    return _DartEmitterVisitor;
}(abstract_emitter_1.AbstractEmitterVisitor));
function getSuperConstructorCallExpr(stmt) {
    if (stmt instanceof o.ExpressionStatement) {
        var expr = stmt.expr;
        if (expr instanceof o.InvokeFunctionExpr) {
            var fn = expr.fn;
            if (fn instanceof o.ReadVarExpr) {
                if (fn.builtin === o.BuiltinVar.Super) {
                    return expr;
                }
            }
        }
    }
    return null;
}
function isConstType(type) {
    return lang_1.isPresent(type) && type.hasModifier(o.TypeModifier.Const);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFydF9lbWl0dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC10dVZUM3lnYy50bXAvYW5ndWxhcjIvc3JjL2NvbXBpbGVyL291dHB1dC9kYXJ0X2VtaXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEscUJBUU8sMEJBQTBCLENBQUMsQ0FBQTtBQUVsQywyQkFBNEIsZ0NBQWdDLENBQUMsQ0FBQTtBQUU3RCxJQUFZLENBQUMsV0FBTSxjQUFjLENBQUMsQ0FBQTtBQUNsQyxpQ0FPTyxvQkFBb0IsQ0FBQyxDQUFBO0FBQzVCLDBCQUE2QyxhQUFhLENBQUMsQ0FBQTtBQUUzRCxJQUFJLGVBQWUsR0FBRyxtQkFBbUIsQ0FBQztBQUUxQyw4QkFBcUMsR0FBZ0Q7SUFDbkYsSUFBSSxTQUFTLEdBQUcsSUFBSSxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUN6RCxJQUFJLEdBQUcsR0FBRyx3Q0FBcUIsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDL0MsSUFBSSxJQUFXLENBQUM7SUFDaEIsRUFBRSxDQUFDLENBQUMsY0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqQixJQUFJLEdBQVUsR0FBRyxDQUFDO0lBQ3BCLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUNELElBQUksQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHO1FBQ2YsRUFBRSxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQy9CLEdBQUcsQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsQ0FBQyxVQUFVLENBQUMs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QUFDLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7UUFDMUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNyQixFQUFFLENBQUMsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUN6QyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ2pCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQscUJBQXFCLElBQVk7SUFDL0IsTUFBTSxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25FLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBTdHJpbmdXcmFwcGVyLFxuICBSZWdFeHBXcmFwcGVyLFxuICBpc1ByZXNlbnQsXG4gIGlzQmxhbmssXG4gIE1hdGgsXG4gIGlzU3RyaW5nLFxuICBpc0FycmF5XG59IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0xpc3RXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuaW1wb3J0IHtCYXNlRXhjZXB0aW9ufSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtDb21waWxlSWRlbnRpZmllck1ldGFkYXRhfSBmcm9tICcuLi9jb21waWxlX21ldGFkYXRhJztcbmltcG9ydCAqIGFzIG8gZnJvbSAnLi9vdXRwdXRfYXN0JztcbmltcG9ydCB7XG4gIE91dHB1dEVtaXR0ZXIsXG4gIEVtaXR0ZXJWaXNpdG9yQ29udGV4dCxcbiAgQWJzdHJhY3RFbWl0dGVyVmlzaXRvcixcbiAgQ0FUQ0hfRVJST1JfVkFSLFxuICBDQVRDSF9TVEFDS19WQVIsXG4gIGVzY2FwZVNpbmdsZVF1b3RlU3RyaW5nXG59IGZyb20gJy4vYWJzdHJhY3RfZW1pdHRlcic7XG5pbXBvcnQge2dldEltcG9ydE1vZHVsZVBhdGgsIEltcG9ydEVudn0gZnJvbSAnLi9wYXRoX3V0aWwnO1xuXG52YXIgX2RlYnVnTW9kdWxlVXJsID0gJ2Fzc2V0Oi8vZGVidWcvbGliJztcblxuZXhwb3J0IGZ1bmN0aW9uIGRlYnVnT3V0cHV0QXN0QXNEYXJ0KGFzdDogby5TdGF0ZW1lbnQgfCBvLkV4cHJlc3Npb24gfCBvLlR5cGUgfCBhbnlbXSk6IHN0cmluZyB7XG4gIHZhciBjb252ZXJ0ZXIgPSBuZXcgX0RhcnRFbWl0dGVyVmlzaXRvcihfZGVidWdNb2R1bGVVcmwpO1xuICB2YXIgY3R4ID0gRW1pdHRlclZpc2l0b3JDb250ZXh0LmNyZWF0ZVJvb3QoW10pO1xuICB2YXIgYXN0czogYW55W107XG4gIGlmIChpc0FycmF5KGFzdCkpIHtcbiAgICBhc3RzID0gPGFueVtdPmFzdDtcbiAgfSBlbHNlIHtcbiAgICBhc3RzID0gW2FzdF07XG4gIH1cbiAgYXN0cy5mb3JFYWNoKChhc3QpID0+IHtcbiAgICBpZiAoYXN0IGluc3RhbmNlb2Ygby5TdGF0ZW1lbnQpIHtcbiAgICAgIGFzdC52aXNpdFN0YXRlbWVudChjb252ZXJ0ZXIsIGN0eCk7XG4gICAgfSBlbHNlIGlmIChhc3QgaW5zdGFuY2VvZiBvLkV4cHJlc3Npb24pIHtcbiAgICAgIGFzdC52aXNpdEV4cHJlc3Npb24oY29udmVydGVyLCBjdHgpO1xuICAgIH0gZWxzZSBpZiAoYXN0IGluc3RhbmNlb2Ygby5UeXBlKSB7XG4gICAgICBhc3QudmlzaXRUeXBlKGNvbnZlcnRlciwgY3R4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oYERvbid0IGtub3cgaG93IHRvIHByaW50IGRlYnVnIGluZm8gZm9yICR7YXN0fWApO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBjdHgudG9Tb3VyY2UoKTtcbn1cblxuZXhwb3J0IGNsYXNzIERhcnRFbWl0dGVyIGltcGxlbWVudHMgT3V0cHV0RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKCkge31cbiAgZW1pdFN0YXRlbWVudHMobW9kdWxlVXJsOiBzdHJpbmcsIHN0bXRzOiBvLlN0YXRlbWVudFtdLCBleHBvcnRlZFZhcnM6IHN0cmluZ1tdKTogc3RyaW5nIHtcbiAgICB2YXIgc3JjUGFydHMgPSBbXTtcbiAgICAvLyBOb3RlOiBXZSBhcmUgbm90IGNyZWF0aW5nIGEgbGlicmFyeSBoZXJlIGFzIERhcnQgZG9lcyBub3QgbmVlZCBpdC5cbiAgICAvLyBEYXJ0IGFuYWx6eWVyIG1pZ2h0IGNvbXBsYWluIGFib3V0IGl0IHRob3VnaC5cblxuICAgIHZhciBjb252ZXJ0ZXIgPSBuZXcgX0RhcnRFbWl0dGVyVmlzaXRvcihtb2R1bGVVcmwpO1xuICAgIHZhciBjdHggPSBFbWl0dGVyVmlzaXRvckNvbnRleHQuY3JlYXRlUm9vdChleHBvcnRlZFZhcnMpO1xuICAgIGNvbnZlcnRlci52aXNpdEFsbFN0YXRlbWVudHMoc3RtdHMsIGN0eCk7XG5cbiAgICBjb252ZXJ0ZXIuaW1wb3J0c1dpdGhQcmVmaXhlcy5mb3JFYWNoKChwcmVmaXgsIGltcG9ydGVkTW9kdWxlVXJsKSA9PiB7XG4gICAgICBzcmNQYXJ0cy5wdXNoKFxuICAgICAgICAgIGBpbXBvcnQgJyR7Z2V0SW1wb3J0TW9kdWxlUGF0aChtb2R1bGVVcmwsIGltcG9ydGVkTW9kdWxlVXJsLCBJbXBvcnRFbnYuRGFydCl9JyBhcyAke3ByZWZpeH07YCk7XG4gICAgfSk7XG4gICAgc3JjUGFydHMucHVzaChjdHgudG9Tb3VyY2UoKSk7XG4gICAgcmV0dXJuIHNyY1BhcnRzLmpvaW4oJ1xcbicpO1xuICB9XG59XG5cbmNsYXNzIF9EYXJ0RW1pdHRlclZpc2l0b3IgZXh0ZW5kcyBBYnN0cmFjdEVtaXR0ZXJWaXNpdG9yIGltcGxlbWVudHMgby5UeXBlVmlzaXRvciB7XG4gIGltcG9ydHNXaXRoUHJlZml4ZXMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX21vZHVsZVVybDogc3RyaW5nKSB7IHN1cGVyKHRydWUpOyB9XG5cbiAgdmlzaXRFeHRlcm5hbEV4cHIoYXN0OiBvLkV4dGVybmFsRXhwciwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiBhbnkge1xuICAgIHRoaXMuX3Zpc2l0SWRlbnRpZmllcihhc3QudmFsdWUsIGFzdC50eXBlUGFyYW1zLCBjdHgpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0RGVjbGFyZVZhclN0bXQoc3RtdDogby5EZWNsYXJlVmFyU3RtdCwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiBhbnkge1xuICAgIGlmIChzdG10Lmhhc01vZGlmaWVyKG8uU3RtdE1vZGlmaWVyLkZpbmFsKSkge1xuICAgICAgaWYgKGlzQ29uc3RUeXBlKHN0bXQudHlwZSkpIHtcbiAgICAgICAgY3R4LnByaW50KGBjb25zdCBgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN0eC5wcmludChgZmluYWwgYCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc0JsYW5rKHN0bXQudHlwZSkpIHtcbiAgICAgIGN0eC5wcmludChgdmFyIGApO1xuICAgIH1cbiAgICBpZiAoaXNQcmVzZW50KHN0bXQudHlwZSkpIHtcbiAgICAgIHN0bXQudHlwZS52aXNpdFR5cGUodGhpcywgY3R4KTtcbiAgICAgIGN0eC5wcmludChgIGApO1xuICAgIH1cbiAgICBjdHgucHJpbnQoYCR7c3RtdC5uYW1lfSA9IGApO1xuICAgIHN0bXQudmFsdWUudmlzaXRFeHByZXNzaW9uKHRoaXMsIGN0eCk7XG4gICAgY3R4LnByaW50bG4oYDtgKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdENhc3RFeHByKGFzdDogby5DYXN0RXhwciwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiBhbnkge1xuICAgIGN0eC5wcmludChgKGApO1xuICAgIGFzdC52YWx1ZS52aXNpdEV4cHJlc3Npb24odGhpcywgY3R4KTtcbiAgICBjdHgucHJpbnQoYCBhcyBgKTtcbiAgICBhc3QudHlwZS52aXNpdFR5cGUodGhpcywgY3R4KTtcbiAgICBjdHgucHJpbnQoYClgKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdERlY2xhcmVDbGFzc1N0bXQoc3RtdDogby5DbGFzc1N0bXQsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICBjdHgucHVzaENsYXNzKHN0bXQpO1xuICAgIGN0eC5wcmludChgY2xhc3MgJHtzdG10Lm5hbWV9YCk7XG4gICAgaWYgKGlzUHJlc2VudChzdG10LnBhcmVudCkpIHtcbiAgICAgIGN0eC5wcmludChgIGV4dGVuZHMgYCk7XG4gICAgICBzdG10LnBhcmVudC52aXNpdEV4cHJlc3Npb24odGhpcywgY3R4KTtcbiAgICB9XG4gICAgY3R4LnByaW50bG4oYCB7YCk7XG4gICAgY3R4LmluY0luZGVudCgpO1xuICAgIHN0bXQuZmllbGRzLmZvckVhY2goKGZpZWxkKSA9PiB0aGlzLl92aXNpdENsYXNzRmllbGQoZmllbGQsIGN0eCkpO1xuICAgIGlmIChpc1ByZXNlbnQoc3RtdC5jb25zdHJ1Y3Rvck1ldGhvZCkpIHtcbiAgICAgIHRoaXMuX3Zpc2l0Q2xhc3NDb25zdHJ1Y3RvcihzdG10LCBjdHgpO1xuICAgIH1cbiAgICBzdG10LmdldHRlcnMuZm9yRWFjaCgoZ2V0dGVyKSA9PiB0aGlzLl92aXNpdENsYXNzR2V0dGVyKGdldHRlciwgY3R4KSk7XG4gICAgc3RtdC5tZXRob2RzLmZvckVhY2goKG1ldGhvZCkgPT4gdGhpcy5fdmlzaXRDbGFzc01ldGhvZChtZXRob2QsIGN0eCkpO1xuICAgIGN0eC5kZWNJbmRlbnQoKTtcbiAgICBjdHgucHJpbnRsbihgfWApO1xuICAgIGN0eC5wb3BDbGFzcygpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHByaXZhdGUgX3Zpc2l0Q2xhc3NGaWVsZChmaWVsZDogby5DbGFzc0ZpZWxkLCBjdHg6IEVtaXR0ZXJWaXNpdG9yQ29udGV4dCkge1xuICAgIGlmIChmaWVsZC5oYXNNb2RpZmllcihvLlN0bXRNb2RpZmllci5GaW5hbCkpIHtcbiAgICAgIGN0eC5wcmludChgZmluYWwgYCk7XG4gICAgfSBlbHNlIGlmIChpc0JsYW5rKGZpZWxkLnR5cGUpKSB7XG4gICAgICBjdHgucHJpbnQoYHZhciBgKTtcbiAgICB9XG4gICAgaWYgKGlzUHJlc2VudChmaWVsZC50eXBlKSkge1xuICAgICAgZmllbGQudHlwZS52aXNpdFR5cGUodGhpcywgY3R4KTtcbiAgICAgIGN0eC5wcmludChgIGApO1xuICAgIH1cbiAgICBjdHgucHJpbnRsbihgJHtmaWVsZC5uYW1lfTtgKTtcbiAgfVxuICBwcml2YXRlIF92aXNpdENsYXNzR2V0dGVyKGdldHRlcjogby5DbGFzc0dldHRlciwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpIHtcbiAgICBpZiAoaXNQcmVzZW50KGdldHRlci50eXBlKSkge1xuICAgICAgZ2V0dGVyLnR5cGUudmlzaXRUeXBlKHRoaXMsIGN0eCk7XG4gICAgICBjdHgucHJpbnQoYCBgKTtcbiAgICB9XG4gICAgY3R4LnByaW50bG4oYGdldCAke2dldHRlci5uYW1lfSB7YCk7XG4gICAgY3R4LmluY0luZGVudCgpO1xuICAgIHRoaXMudmlzaXRBbGxTdGF0ZW1lbnRzKGdldHRlci5ib2R5LCBjdHgpO1xuICAgIGN0eC5kZWNJbmRlbnQoKTtcbiAgICBjdHgucHJpbnRsbihgfWApO1xuICB9XG4gIHByaXZhdGUgX3Zpc2l0Q2xhc3NDb25zdHJ1Y3RvcihzdG10OiBvLkNsYXNzU3RtdCwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpIHtcbiAgICBjdHgucHJpbnQoYCR7c3RtdC5uYW1lfShgKTtcbiAgICB0aGlzLl92aXNpdFBhcmFtcyhzdG10LmNvbnN0cnVjdG9yTWV0aG9kLnBhcmFtcywgY3R4KTtcbiAgICBjdHgucHJpbnQoYClgKTtcblxuICAgIHZhciBjdG9yU3RtdHMgPSBzdG10LmNvbnN0cnVjdG9yTWV0aG9kLmJvZHk7XG4gICAgdmFyIHN1cGVyQ3RvckV4cHIgPSBjdG9yU3RtdHMubGVuZ3RoID4gMCA/IGdldFN1cGVyQ29uc3RydWN0b3JDYWxsRXhwcihjdG9yU3RtdHNbMF0pIDogbnVsbDtcbiAgICBpZiAoaXNQcmVzZW50KHN1cGVyQ3RvckV4cHIpKSB7XG4gICAgICBjdHgucHJpbnQoYDogYCk7XG4gICAgICBzdXBlckN0b3JFeHByLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjdHgpO1xuICAgICAgY3RvclN0bXRzID0gY3RvclN0bXRzLnNsaWNlKDEpO1xuICAgIH1cbiAgICBjdHgucHJpbnRsbihgIHtgKTtcbiAgICBjdHguaW5jSW5kZW50KCk7XG4gICAgdGhpcy52aXNpdEFsbFN0YXRlbWVudHMoY3RvclN0bXRzLCBjdHgpO1xuICAgIGN0eC5kZWNJbmRlbnQoKTtcbiAgICBjdHgucHJpbnRsbihgfWApO1xuICB9XG4gIHByaXZhdGUgX3Zpc2l0Q2xhc3NNZXRob2QobWV0aG9kOiBvLkNsYXNzTWV0aG9kLCBjdHg6IEVtaXR0ZXJWaXNpdG9yQ29udGV4dCkge1xuICAgIGlmIChpc1ByZXNlbnQobWV0aG9kLnR5cGUpKSB7XG4gICAgICBtZXRob2QudHlwZS52aXNpdFR5cGUodGhpcywgY3R4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LnByaW50KGB2b2lkYCk7XG4gICAgfVxuICAgIGN0eC5wcmludChgICR7bWV0aG9kLm5hbWV9KGApO1xuICAgIHRoaXMuX3Zpc2l0UGFyYW1zKG1ldGhvZC5wYXJhbXMsIGN0eCk7XG4gICAgY3R4LnByaW50bG4oYCkge2ApO1xuICAgIGN0eC5pbmNJbmRlbnQoKTtcbiAgICB0aGlzLnZpc2l0QWxsU3RhdGVtZW50cyhtZXRob2QuYm9keSwgY3R4KTtcbiAgICBjdHguZGVjSW5kZW50KCk7XG4gICAgY3R4LnByaW50bG4oYH1gKTtcbiAgfVxuXG4gIHZpc2l0RnVuY3Rpb25FeHByKGFzdDogby5GdW5jdGlvbkV4cHIsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICBjdHgucHJpbnQoYChgKTtcbiAgICB0aGlzLl92aXNpdFBhcmFtcyhhc3QucGFyYW1zLCBjdHgpO1xuICAgIGN0eC5wcmludGxuKGApIHtgKTtcbiAgICBjdHguaW5jSW5kZW50KCk7XG4gICAgdGhpcy52aXNpdEFsbFN0YXRlbWVudHMoYXN0LnN0YXRlbWVudHMsIGN0eCk7XG4gICAgY3R4LmRlY0luZGVudCgpO1xuICAgIGN0eC5wcmludChgfWApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0RGVjbGFyZUZ1bmN0aW9uU3RtdChzdG10OiBvLkRlY2xhcmVGdW5jdGlvblN0bXQsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICBpZiAoaXNQcmVzZW50KHN0bXQudHlwZSkpIHtcbiAgICAgIHN0bXQudHlwZS52aXNpdFR5cGUodGhpcywgY3R4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LnByaW50KGB2b2lkYCk7XG4gICAgfVxuICAgIGN0eC5wcmludChgICR7c3RtdC5uYW1lfShgKTtcbiAgICB0aGlzLl92aXNpdFBhcmFtcyhzdG10LnBhcmFtcywgY3R4KTtcbiAgICBjdHgucHJpbnRsbihgKSB7YCk7XG4gICAgY3R4LmluY0luZGVudCgpO1xuICAgIHRoaXMudmlzaXRBbGxTdGF0ZW1lbnRzKHN0bXQuc3RhdGVtZW50cywgY3R4KTtcbiAgICBjdHguZGVjSW5kZW50KCk7XG4gICAgY3R4LnByaW50bG4oYH1gKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldEJ1aWx0aW5NZXRob2ROYW1lKG1ldGhvZDogby5CdWlsdGluTWV0aG9kKTogc3RyaW5nIHtcbiAgICB2YXIgbmFtZTtcbiAgICBzd2l0Y2ggKG1ldGhvZCkge1xuICAgICAgY2FzZSBvLkJ1aWx0aW5NZXRob2QuQ29uY2F0QXJyYXk6XG4gICAgICAgIG5hbWUgPSAnLmFkZEFsbCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBvLkJ1aWx0aW5NZXRob2QuU3Vic2NyaWJlT2JzZXJ2YWJsZTpcbiAgICAgICAgbmFtZSA9ICdsaXN0ZW4nO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBVbmtub3duIGJ1aWx0aW4gbWV0aG9kOiAke21ldGhvZH1gKTtcbiAgICB9XG4gICAgcmV0dXJuIG5hbWU7XG4gIH1cbiAgdmlzaXRUcnlDYXRjaFN0bXQoc3RtdDogby5UcnlDYXRjaFN0bXQsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICBjdHgucHJpbnRsbihgdHJ5IHtgKTtcbiAgICBjdHguaW5jSW5kZW50KCk7XG4gICAgdGhpcy52aXNpdEFsbFN0YXRlbWVudHMoc3RtdC5ib2R5U3RtdHMsIGN0eCk7XG4gICAgY3R4LmRlY0luZGVudCgpO1xuICAgIGN0eC5wcmludGxuKGB9IGNhdGNoICgke0NBVENIX0VSUk9SX1ZBUi5uYW1lfSwgJHtDQVRDSF9TVEFDS19WQVIubmFtZX0pIHtgKTtcbiAgICBjdHguaW5jSW5kZW50KCk7XG4gICAgdGhpcy52aXNpdEFsbFN0YXRlbWVudHMoc3RtdC5jYXRjaFN0bXRzLCBjdHgpO1xuICAgIGN0eC5kZWNJbmRlbnQoKTtcbiAgICBjdHgucHJpbnRsbihgfWApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0QmluYXJ5T3BlcmF0b3JFeHByKGFzdDogby5CaW5hcnlPcGVyYXRvckV4cHIsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICBzd2l0Y2ggKGFzdC5vcGVyYXRvcikge1xuICAgICAgY2FzZSBvLkJpbmFyeU9wZXJhdG9yLklkZW50aWNhbDpcbiAgICAgICAgY3R4LnByaW50KGBpZGVudGljYWwoYCk7XG4gICAgICAgIGFzdC5saHMudmlzaXRFeHByZXNzaW9uKHRoaXMsIGN0eCk7XG4gICAgICAgIGN0eC5wcmludChgLCBgKTtcbiAgICAgICAgYXN0LnJocy52aXNpdEV4cHJlc3Npb24odGhpcywgY3R4KTtcbiAgICAgICAgY3R4LnByaW50KGApYCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBvLkJpbmFyeU9wZXJhdG9yLk5vdElkZW50aWNhbDpcbiAgICAgICAgY3R4LnByaW50KGAhaWRlbnRpY2FsKGApO1xuICAgICAgICBhc3QubGhzLnZpc2l0RXhwcmVzc2lvbih0aGlzLCBjdHgpO1xuICAgICAgICBjdHgucHJpbnQoYCwgYCk7XG4gICAgICAgIGFzdC5yaHMudmlzaXRFeHByZXNzaW9uKHRoaXMsIGN0eCk7XG4gICAgICAgIGN0eC5wcmludChgKWApO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHN1cGVyLnZpc2l0QmluYXJ5T3BlcmF0b3JFeHByKGFzdCwgY3R4KTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRMaXRlcmFsQXJyYXlFeHByKGFzdDogby5MaXRlcmFsQXJyYXlFeHByLCBjdHg6IEVtaXR0ZXJWaXNpdG9yQ29udGV4dCk6IGFueSB7XG4gICAgaWYgKGlzQ29uc3RUeXBlKGFzdC50eXBlKSkge1xuICAgICAgY3R4LnByaW50KGBjb25zdCBgKTtcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLnZpc2l0TGl0ZXJhbEFycmF5RXhwcihhc3QsIGN0eCk7XG4gIH1cbiAgdmlzaXRMaXRlcmFsTWFwRXhwcihhc3Q6IG8uTGl0ZXJhbE1hcEV4cHIsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICBpZiAoaXNDb25zdFR5cGUoYXN0LnR5cGUpKSB7XG4gICAgICBjdHgucHJpbnQoYGNvbnN0IGApO1xuICAgIH1cbiAgICBpZiAoaXNQcmVzZW50KGFzdC52YWx1ZVR5cGUpKSB7XG4gICAgICBjdHgucHJpbnQoYDxTdHJpbmcsIGApO1xuICAgICAgYXN0LnZhbHVlVHlwZS52aXNpdFR5cGUodGhpcywgY3R4KTtcbiAgICAgIGN0eC5wcmludChgPmApO1xuICAgIH1cbiAgICByZXR1cm4gc3VwZXIudmlzaXRMaXRlcmFsTWFwRXhwcihhc3QsIGN0eCk7XG4gIH1cbiAgdmlzaXRJbnN0YW50aWF0ZUV4cHIoYXN0OiBvLkluc3RhbnRpYXRlRXhwciwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiBhbnkge1xuICAgIGN0eC5wcmludChpc0NvbnN0VHlwZShhc3QudHlwZSkgPyBgY29uc3RgIDogYG5ld2ApO1xuICAgIGN0eC5wcmludCgnICcpO1xuICAgIGFzdC5jbGFzc0V4cHIudmlzaXRFeHByZXNzaW9uKHRoaXMsIGN0eCk7XG4gICAgY3R4LnByaW50KGAoYCk7XG4gICAgdGhpcy52aXNpdEFsbEV4cHJlc3Npb25zKGFzdC5hcmdzLCBjdHgsIGAsYCk7XG4gICAgY3R4LnByaW50KGApYCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRCdWlsdGludFR5cGUodHlwZTogby5CdWlsdGluVHlwZSwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiBhbnkge1xuICAgIHZhciB0eXBlU3RyO1xuICAgIHN3aXRjaCAodHlwZS5uYW1lKSB7XG4gICAgICBjYXNlIG8uQnVpbHRpblR5cGVOYW1lLkJvb2w6XG4gICAgICAgIHR5cGVTdHIgPSAnYm9vbCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBvLkJ1aWx0aW5UeXBlTmFtZS5EeW5hbWljOlxuICAgICAgICB0eXBlU3RyID0gJ2R5bmFtaWMnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Ugby5CdWlsdGluVHlwZU5hbWUuRnVuY3Rpb246XG4gICAgICAgIHR5cGVTdHIgPSAnRnVuY3Rpb24nO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Ugby5CdWlsdGluVHlwZU5hbWUuTnVtYmVyOlxuICAgICAgICB0eXBlU3RyID0gJ251bSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBvLkJ1aWx0aW5UeXBlTmFtZS5JbnQ6XG4gICAgICAgIHR5cGVTdHIgPSAnaW50JztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIG8uQnVpbHRpblR5cGVOYW1lLlN0cmluZzpcbiAgICAgICAgdHlwZVN0ciA9ICdTdHJpbmcnO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBCYXNlRXhjZXB0aW9uKGBVbnN1cHBvcnRlZCBidWlsdGluIHR5cGUgJHt0eXBlLm5hbWV9YCk7XG4gICAgfVxuICAgIGN0eC5wcmludCh0eXBlU3RyKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdEV4dGVybmFsVHlwZShhc3Q6IG8uRXh0ZXJuYWxUeXBlLCBjdHg6IEVtaXR0ZXJWaXNpdG9yQ29udGV4dCk6IGFueSB7XG4gICAgdGhpcy5fdmlzaXRJZGVudGlmaWVyKGFzdC52YWx1ZSwgYXN0LnR5cGVQYXJhbXMsIGN0eCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXRBcnJheVR5cGUodHlwZTogby5BcnJheVR5cGUsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICBjdHgucHJpbnQoYExpc3Q8YCk7XG4gICAgaWYgKGlzUHJlc2VudCh0eXBlLm9mKSkge1xuICAgICAgdHlwZS5vZi52aXNpdFR5cGUodGhpcywgY3R4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LnByaW50KGBkeW5hbWljYCk7XG4gICAgfVxuICAgIGN0eC5wcmludChgPmApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0TWFwVHlwZSh0eXBlOiBvLk1hcFR5cGUsIGN0eDogRW1pdHRlclZpc2l0b3JDb250ZXh0KTogYW55IHtcbiAgICBjdHgucHJpbnQoYE1hcDxTdHJpbmcsIGApO1xuICAgIGlmIChpc1ByZXNlbnQodHlwZS52YWx1ZVR5cGUpKSB7XG4gICAgICB0eXBlLnZhbHVlVHlwZS52aXNpdFR5cGUodGhpcywgY3R4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LnByaW50KGBkeW5hbWljYCk7XG4gICAgfVxuICAgIGN0eC5wcmludChgPmApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBfdmlzaXRQYXJhbXMocGFyYW1zOiBvLkZuUGFyYW1bXSwgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiB2b2lkIHtcbiAgICB0aGlzLnZpc2l0QWxsT2JqZWN0cygocGFyYW0pID0+IHtcbiAgICAgIGlmIChpc1ByZXNlbnQocGFyYW0udHlwZSkpIHtcbiAgICAgICAgcGFyYW0udHlwZS52aXNpdFR5cGUodGhpcywgY3R4KTtcbiAgICAgICAgY3R4LnByaW50KCcgJyk7XG4gICAgICB9XG4gICAgICBjdHgucHJpbnQocGFyYW0ubmFtZSk7XG4gICAgfSwgcGFyYW1zLCBjdHgsICcsJyk7XG4gIH1cblxuICBwcml2YXRlIF92aXNpdElkZW50aWZpZXIodmFsdWU6IENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGEsIHR5cGVQYXJhbXM6IG8uVHlwZVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgY3R4OiBFbWl0dGVyVmlzaXRvckNvbnRleHQpOiB2b2lkIHtcbiAgICBpZiAoaXNQcmVzZW50KHZhbHVlLm1vZHVsZVVybCkgJiYgdmFsdWUubW9kdWxlVXJsICE9IHRoaXMuX21vZHVsZVVybCkge1xuICAgICAgdmFyIHByZWZpeCA9IHRoaXMuaW1wb3J0c1dpdGhQcmVmaXhlcy5nZXQodmFsdWUubW9kdWxlVXJsKTtcbiAgICAgIGlmIChpc0JsYW5rKHByZWZpeCkpIHtcbiAgICAgICAgcHJlZml4ID0gYGltcG9ydCR7dGhpcy5pbXBvcnRzV2l0aFByZWZpeGVzLnNpemV9YDtcbiAgICAgICAgdGhpcy5pbXBvcnRzV2l0aFByZWZpeGVzLnNldCh2YWx1ZS5tb2R1bGVVcmwsIHByZWZpeCk7XG4gICAgICB9XG4gICAgICBjdHgucHJpbnQoYCR7cHJlZml4fS5gKTtcbiAgICB9XG4gICAgY3R4LnByaW50KHZhbHVlLm5hbWUpO1xuICAgIGlmIChpc1ByZXNlbnQodHlwZVBhcmFtcykgJiYgdHlwZVBhcmFtcy5sZW5ndGggPiAwKSB7XG4gICAgICBjdHgucHJpbnQoYDxgKTtcbiAgICAgIHRoaXMudmlzaXRBbGxPYmplY3RzKCh0eXBlKSA9PiB0eXBlLnZpc2l0VHlwZSh0aGlzLCBjdHgpLCB0eXBlUGFyYW1zLCBjdHgsICcsJyk7XG4gICAgICBjdHgucHJpbnQoYD5gKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0U3VwZXJDb25zdHJ1Y3RvckNhbGxFeHByKHN0bXQ6IG8uU3RhdGVtZW50KTogby5FeHByZXNzaW9uIHtcbiAgaWYgKHN0bXQgaW5zdGFuY2VvZiBvLkV4cHJlc3Npb25TdGF0ZW1lbnQpIHtcbiAgICB2YXIgZXhwciA9IHN0bXQuZXhwcjtcbiAgICBpZiAoZXhwciBpbnN0YW5jZW9mIG8uSW52b2tlRnVuY3Rpb25FeHByKSB7XG4gICAgICB2YXIgZm4gPSBleHByLmZuO1xuICAgICAgaWYgKGZuIGluc3RhbmNlb2Ygby5SZWFkVmFyRXhwcikge1xuICAgICAgICBpZiAoZm4uYnVpbHRpbiA9PT0gby5CdWlsdGluVmFyLlN1cGVyKSB7XG4gICAgICAgICAgcmV0dXJuIGV4cHI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzQ29uc3RUeXBlKHR5cGU6IG8uVHlwZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gaXNQcmVzZW50KHR5cGUpICYmIHR5cGUuaGFzTW9kaWZpZXIoby5UeXBlTW9kaWZpZXIuQ29uc3QpO1xufSJdfQ==